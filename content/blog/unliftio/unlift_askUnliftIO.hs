#!/usr/bin/env stack
{-# LANGUAGE RankNTypes          #-}
{-# LANGUAGE ScopedTypeVariables #-}

{-
    stack
    script
    --resolver lts-13.16
    --package transformers
-}
import           Control.Monad.IO.Class
import           Control.Monad.Trans.Reader (ReaderT (..))

-- This function is a simpler version of the example given in
-- http://hackage.haskell.org/package/unliftio
test :: (String -> IO ()) -> IO ()
test f = f "test"

test2 :: (String -> ReaderT env IO ()) -> ReaderT env IO ()
test2 f =
  askUnliftIO
        -- askUnliftIO has the function signature `m (UnliftIO m)`. By using
        -- monadic bind (>>=) the right hand side of that bind gets access to
        -- the "contents" (UnliftIO m) inside the outer m.  That content is a
        -- function, accepting an m a and giving us an IO a (see bottom of the
        -- file)
   >>= \wrappedUnliftedThing ->
    let unwrapped = unwrap wrappedUnliftedThing
     -- Unwrap the newtype wrapper, which is only necessary for GHC/type reasons. Why?
     -- Imagine this didn't exist and we could just use wrappedUnliftedThing directly
     in liftIO $ test (unwrapped . f)
     -- test will first call f with a string, giving us a reader. That reader
     -- is passed to unwrapped, which has the type signature `m a -> IO a`.
     -- That fits since the `m a` part will be `ReaderT env a` here. Finally,
     -- that IO a is lifted, so we're back in `ReaderT env a`
  where
    unwrap :: UnliftIO m -> m a -> IO a
    -- ^ Only for the type signature
    unwrap = unliftIO

-- maybe this is relevant liftIO :: MonadIO m => IO a -> m a
main :: IO ()
main = runReaderT (test2 myPrint) "Environment"
                      -- ^^^^^^^ f in test2

myPrint :: String -> ReaderT String IO ()
myPrint string = ReaderT $ \env -> print $ env ++ " " ++ string

instance MonadUnliftIO IO where
  askUnliftIO = return (UnliftIO id)

instance MonadUnliftIO m => MonadUnliftIO (ReaderT r m) where
  askUnliftIO =
    ReaderT $ \env ->
      askUnliftIO >>= \unliftedIO
   -- ^^^^^^ This is the askUnliftIO from the IO instance
       -> liftIO $ (UnliftIO (unliftIO unliftedIO . flip runReaderT env))

-- What's the type signature of        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
-- Think I got it actually ... runReaderT here gives me the m, which should be IO and the `unliftIO unliftedIO` is just identiy so the whole thing is the m a -> IO a
newtype UnliftIO m = UnliftIO
  { unliftIO :: forall a. m a -> IO a
  }

class MonadIO m =>
      MonadUnliftIO m
  where
  askUnliftIO :: m (UnliftIO m)
