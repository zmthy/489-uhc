{-# LANGUAGE EmptyDataDecls #-}
module Melchior.Dom
    ( -- * Types
      Dom
    , Element (unEl)
    , Node
    , Document
    , Input
    , Div
      -- * Typeclasses
    , DomNode
      -- * Functions
    , toElement
    , toInput
    , toDiv
    , document
    , setBody
    , addClass
    , removeClass
    , toggle
    , parentOf
    , siblings
    , append
    ) where

--dependencies
import Melchior.Dom.Events
import Control.Monad (liftM)
import Language.UHC.JScript.ECMA.String
import Language.UHC.JScript.Primitives

data Dom a = Dom (IO a)
data Node
newtype Element = Element { unEl :: JSPtr Node }
newtype Document = Document {unDoc ::  JSPtr Node }
newtype Input = Input { unIn :: JSPtr Node }
newtype Div = Div { unDiv :: JSPtr Node }
newtype Span = Span {unSpan :: JSPtr Node}

foreign import js "document"
  document :: Document

instance Monad Dom where
  return = Dom . return
  (Dom io) >>= k = Dom $ io >>= \x -> let Dom io' = k x in io'

class DomNode a where
instance DomNode Element where
instance DomNode Input where
instance DomNode Document where

foreign import js "id(%2)"
  toElement :: (DomNode a) => a -> Element

foreign import js "Selectors.toInput(%2)"
  toInput ::(DomNode a) =>  a -> Input

foreign import js "Selectors.toDocument(%2)"
  toDocument ::(DomNode a) =>  a -> Document

foreign import js "Selectors.toDiv(%2)"
  toDiv :: (DomNode a) => a -> Div

foreign import js "Selectors.toSpan(%2)"
  toSpan :: (DomNode a) => a -> Span

foreign import js "Dom.set(%1, 'innerHTML', %2)"
  setBody :: Element -> JSString -> Dom ()

foreign import js "Dom.addClass(%2, %1)"
  addClass :: JSString -> Element -> JSString

foreign import js "Dom.removeClass(%2, %1)"
  removeClass :: JSString -> Element -> JSString

foreign import js "Dom.toggle(%2, %1)"
  toggle :: JSString -> Element -> JSString

foreign import js "%1.parentNode"
  parentOf :: Element -> Element

foreign import js "Dom.siblings(%1)"
  siblings :: Element -> [Element]

foreign import js "Dom.hack(%1)"
  append :: JSString -> JSString

{-
getAttr :: String -> Element -> Dom String
getAttr s e = Dom . liftM jsStringToString $ primGetAttr e (stringToJSString s)

foreign import js "%1.getAttribute(%2)"
  primGetAttr :: Element -> JSString -> IO JSString-}
