// ==========================================================================
// Project:   Mata - Additional Stuff for SproutCore
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Mata */

sc_require('core');

Mata.DEFAULT_VISITOR_ACCEPT_PREFIX = 'accept';
Mata.UNKNOWN_VISITED_SUFFIX = 'UnknownVisited';

/** @mixin

  Applies visitable support to any class in order to provide flexability in how
  an object is visited and accepted.
  
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  
  This mixin will only work with SproutCore v1.4.3 or above
  
  For this to work in IE 7/8 you have to make sure that the module containing the 
  class to visit has been set up correctly in order for SproutCore to detect an 
  object's type in IE. As an example, you'll need do the following:
      
      window.MyApp = window.MyApp || SC.Object.create();
        
  Don't do this:
        
      var MyApp = MyApp || {};
      
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
  h2. Overview
  
  Visitable support is based on the OOP visitor design pattern. The pattern creates a 
  decoupling from the object that wants to visit specific instances of objects 
  that derive from a common class and those objects that accept being visited.
  
  A common scenario is when a function is given a generic object and the 
  function needs to determine the object's type so it knows what logic to execute. 
  Typically this checking is done by determining the given object's type in a 
  series of if-else statements, such as following:
  
  {{{
  
    MyApp.Thing = SC.Object.extend({ ... });
    MyApp.AbcThing = MyApp.Thing.extend({ ... });
    MyApp.XyzThing = MyApp.Thing.extend({ ... });

    ...

    foo: function(thing) {
      
      if (SC.kindOf(thing, MyApp.AbcThing)) {
         ... do stuff specific for AbcThing
      } 
      else if (SC.kindOf(thing, MyApp.XyzThing)) {
         ... do stuff specific for XyzThing
      }
      
    }

  }}} 
  
  The problem with the logic above is that whenever a new object is introduced
  that inherits from a common base class the if-else logic needs to be updated. This
  violates the OO open/closed principle (open for extension, but closed for modification)
  and creates brittle code. Using the visitor pattern we can change the logic to be
  the following:
  
  {{{
  
    MyApp.Thing = SC.Object.extend({
      visit: function(visitor) { 
        // no-op 
      }
    });
    
    MyApp.AbcThing = MyApp.Thing.extend({
      visit: function(visitor) { return visitor.acceptAbcThing(this); }
    });
    
    MyApp.XyzThing = MyApp.Thing.extend({ 
      visit: function(visitor) { return visitor.acceptXyzThing(this); }
    });
    
    ...
  
    foo: function(thing) {
       thing.visit(this);
    }
    
    acceptAbcThing: function(thing) {
      ... do stuff specific for ABC
    },
    
    acceptXyzThing: function(thing) {
      ... do stuff specific for XYZ
    }
  
  }}}
  
  In the code above, the foo function is simplified down to a simple visit call on the
  given object, so no if-else statements are required whenever a new type of object is
  supplied that derives from a common base class. The visited object then accepts the visitor
  by calling a corresponding accept method based on the visited object's type. Now the 
  logic for each object type is isolated to a specific function that is invoked 
  by the given visited object. 
  
  The visitable mixin simplifies the visitor pattern even further by doing the
  following:
  
  {{{
  
    MyApp.Thing = SC.Object.extend(Mata.Visitable);
    
    MyApp.AbcThing = MyApp.Thing.extend({ ... });
    MyApp.XyzThing = MyApp.Thing.extend({ ... });
    
    ... 
    
    foo: function(thing) {
       thing.visit(this);
    }
    
    acceptAbcThing: function(thing) {
      ... do stuff specific for ABC
    },
    
    acceptXyzThing: function(thing) {
      ... do stuff specific for XYZ
    }
  
  }}}
  
  At minimum, all you have to do is mix in the Visitable mixin into the the base 
  class that other classes derive from. In the case above the mixin will automatically 
  check the visited object's type and prefix a default "accept" to the type name in 
  order to generate a function name that can be called on the visitor.
  
  h2. Using Properties to Visit Objects
  
  What about when you want to visit an object based on a specific property rather
  then its type? This type of scenario can occur, such as in the following:
  
  {{{
  
    MyApp.Operator = SC.Object.extend({  
      value: null
    });
    
    MyApp.Operator.ADD = MyApp.Operator.create({ value: 'add' });
    MyApp.Operator.SUBTRACT = MyApp.Operator.create({ value: 'subtract' });
  
  }}}
  
  Above the ADD and SUBTRACT operator object constants only vary based on the value property, 
  not their type. We can apply the Visitable mixin to make the operators visitable by
  doing the following:
  
  {{{
  
    MyApp.Operator = SC.Object.extend(Mata.Visitable, {  
      value: null,
      
      visitKey: 'value'
    });
    
    ...
    
    foo: function(operator) {
      operator.visit(this);
    },
    
    acceptAdd: function(operator) { ... },
    
    acceptSubtract: function(operator) { ... }
  
  }}}
  
  The visit method takes the visitKey to acquire a property's value on the object, such as 
  "add". The value is then combined with the default accept function prefix "accept" to produce 
  "acceptAdd". (The first character from the value is always uppercased.)  
  
  h2. Modifying the Accept Prefix
  
  If you want to make the accept function name more meaningful, you can just update your class 
  by setting the visitorAcceptFunctionPrefix property, like so:
  
  {{{
  
    MyApp.Operator = SC.Object.extend(Mata.Visitable, {  
      value: null,
    
      visitKey: 'value'
      
      visitorAcceptFunctionPrefix: 'acceptOperator'
    });
    
    ...
    
    foo: function(operator) {
      operator.visit(this);
    },
    
    acceptOperatorAdd: function(operator) { ... },
    acceptOperatorSubtract: function(operator) { ... }
  
  }}}
  
  To have even more control over the accept function being invoked, you can also call the the
  visit method by supplying it with an accept prefix. This allows you to supply your own prefix 
  for the accept function and it will not affect the default accept function prefix used when 
  calling the visit method. The following demonstrates how to supply an accept prefix to the
  visist method:
  
  {{{
  
    MyApp.Operator = SC.Object.extend(Mata.Visitable);
    
    MyApp.Add = MyApp.Operator.extend(MyApp.Operator);
    MyApp.Subtract = MyApp.Operator.extend(MyApp.Operator);
  
    ...
  
    foo: function(operator) {
      operator.visit(this, 'acceptOperator');
    }
    
    acceptOperatorAdd: function(operator) { ... }
    
    acceptOperatorSubtract: function(operator) { ... }
  
  }}}
  
  h2. Avoiding Accept Method Clobbering
  
  Supplying the optional accept prefix to the visit method is ideal for cases when you need to 
  avoid name collisions. As an example, let's say you have the following:
  
  {{{
  
    MyApp.FooMixin = {
    
      doFoo: function(operator) {
        operator.visit(this);
      },
      
      acceptAdd: function(operator) { ... }
    
    };
    
    MyApp.Thing = SC.Object.extend(MyApp.FooMixin, {
    
      doCheck: function(operator) {
        operator.visit(this);
      },
      
      acceptAdd: function(operator) { ... }
    
    })
  
  }}}
  
  Since the Thing class mixes in FooMixin module, the the acceptAdd method will get clobbered. Because
  the mixin and class are both visiting an operator object for their own purposes, we can avoid 
  the clobbering issue by updating the mixin as follows:
  
  {{{
  
    MyApp.FooMixin = {
  
      doFoo: function(operator) {
        operator.visit(this, "_mafoo_accept");
      },
    
      _mafoo_acceptAdd: function(operator) { ... }
  
    };
  
  }}}
  
  Another example of when clobbering can occur is when you have an object that can visit the same 
  type of object but for different purposes. As an example:
  
  {{{
  
    MyApp.WidgetView = SC.View.extend({
    
      doFoo: function(operator) {
        operator.visit(this);
      },
      
      doBar: function(operator) {
        operator.visit(this);
      },
      
      acceptAdd: function(operator) { ... },
      
      acceptSubtract: functino(operator) { ... }
    
    });
  
  }}}
  
  Above, the WidgetView needs to visit an given operator object but for two different purposes, say,
  in order to render itself or handle a user action. The problem that call doFoo and doBar will both
  call the acceptAdd and acceptSubtract methods when we need different logic to execute based on what
  was accepted. We can get around this problem by updating the code to be the following:
  
  {{{
  
    MyApp.WidgetView = SC.View.extend({
    
      doFoo: function(operator) {
        operator.visit(this, '_foo_accept');
      },
      
      doBar: function(operator) {
        operator.visit(this, '_bar_accept');
      },
      
      _foo_acceptAdd: function(operator) { ... },
      
      _foo_acceptSubtract: functino(operator) { ... },
      
      _bar_acceptAdd: function(operator) { ... },
      
      _bar_acceptSubtract: functino(operator) { ... }
    
    });
  
  }}}  
  
  h2. Handling Unknown Visited Objects
  
  What about the case when an accept method does not exist for an object that has been visited?
  What happens then? In such a scenario, a special method will try to be invoked on the visitor
  that indicates an unknown object was visited. By default, the method invoked is
  acceptUnknownVisited, but this is based on how the default visit accept funtion prefix has
  been set and if the visit method was invoked with a given accept prefix. If the visitor does 
  not have an unknown visited method, then nothing else will be done. As an example:
  
  {{{
  
    MyApp.WidgetView = SC.View.extend({
    
      doFoo: function(operator) {
        operator.visit(this);
      },
      
      acceptAdd: function(operator) { ... },
      
      acceptSubtracct: function(operator) { ... },
      
      acceptUnknownVisited: function(operator) {
        // Only call if this method exists, otherwise nothing
        // will happen
      }
    
    });
  
  }}}  
  
  If you modify the accept prefix then the prefix will also applied to the unknown visited method:
  
  {{{
  
    MyApp.WidgetView = SC.View.extend({
    
      doFoo: function(operator) {
        operator.visit(this, '_accept');
      },
      
      _acceptAdd: function(operator) { ... },
      
      _acceptSubtracct: function(operator) { ... },
      
      _acceptUnknownVisited: function(operator) {
        // Only call if this method exists, otherwise nothing
        // will happen
      }
    
    });
  
  }}} 
  
  h2. Providing Addition Context
  
  There may be cases when you want to supply some additional context to the object being
  visited. You can do this by providing the visit method a context hash value, like so:

  {{{

    foo: function(operator) {
      var context = { apply: YES };
      operator.visit(this, context);
    },

    acceptAdd: function(operator, context) { ... }
    
  }}}

  The context hash value is passed to the visit method which will then be forwarded on
  to the accept method. What about when you want to modify the accept prefix and also
  want to supply a context hash value? You can do the following:
  
  {{{
  
    foo: function(operator) {
      var context = { apply: YES };
      operator.visit(this, 'acceptOperator', context);
    },
  
    acceptOperatorAdd: function(operator, context) { ... }
  
  }}} 

*/

Mata.Visitable = {
  
  // Walk like a duck
  isVisitable: YES,
  
  /**
    Optional. A key to determine what property on the visited object to use
    in order to dynamically construct an accept function name that will
    be invoked on the visitor object.
    
    If the key is not set, then, by default, the visited object's class name
    will be used.
  */
  visitKey: null,
  
  /**
    Prefix used to dynamically construct an accept function name that will be
    invoked on the visitor object.
  */
  visitorAcceptFunctionPrefix: Mata.DEFAULT_VISITOR_ACCEPT_PREFIX,

  /**
    Called by a object that wants to visit an object that is visitable. 
    
    To just visit a visitable object:
    
      object.visit(this);
      
    Visiting using a specific accept prefix:
    
      object.visit(this, '_accept');
      
    Visiting an object and supplying a context object:
    
      object.visit(this, { value: 123 });
      
    Visiting with specific accept prefix and context object:
      
      object.visit(this, '_accept', { value: 123 }); 
    
    @param visitor {SC.Object} the object that wants to visit
    @param acceptPrefix {String} Optional. Accept prefix to use instead of the assigned default
           accept prefix.
    @param context {Hash} Optional. Any additional information to pass along to the visitor
    @return If the invoked accept method returns a value then that value will be returned, otherwise 
            nothing is returned. 
  */
  visit: function(visitor, acceptPrefix, context) {
    if (!SC.kindOf(visitor, SC.Object)) {
      SC.Logger.error('Mata.Visitable: can not accept visitor. visitor must be kind of SC.Object: ' + visitor);
      return;
    }

    var visitKey = this.get('visitKey'),
        visitValue = null,
        acceptFuncPrefix = this.get('visitorAcceptFunctionPrefix'),
        acceptPrefixType = SC.typeOf(acceptPrefix),
        contextType = SC.typeOf(context),
        matches = null;
        
    // Set the accept prefix and context value based on the arguments passed to this method
    if (arguments.length === 2) {
      if (acceptPrefixType === SC.T_HASH) {
        context = acceptPrefix;
      } else if (acceptPrefixType === SC.T_STRING) {
        acceptFuncPrefix = acceptPrefix;
      } else {
        SC.Logger.error('Mata.Visitable: acceptPrefix is of an invalid type: ' + acceptPrefixType);
        return;
      }
    } else if (arguments.length === 3) {
      if (acceptPrefixType !== SC.T_STRING) {
        SC.Logger.error('Mata.Visitable: acceptPrefix is of an invalid type: ' + acceptPrefixType);
        return;
      }
      if (contextType !== SC.T_HASH) {
        SC.Logger.error('Mata.Visitable: context is of an invalid type: ' + contextType);
        return;
      }
      acceptFuncPrefix = acceptPrefix;
    } else if (arguments.length > 3) {
      SC.Logger.error('Mata.Visitable: Too many arguments supplied to visit');
      return;
    }
        
    if (!SC.none(visitKey)) {
      visitValue = this.get(visitKey);
      matches = visitValue.match(/^(\w)(.*)$/);
      if (SC.none(matches)) {
        SC.Logger.error('Mata.Visitable: unable to generate name from visit key\'s value: ' + visitValue);
        return;
      }
      visitValue = matches[1].toUpperCase() + matches[2];
    } 
    else {
      //
      // !!! WARNING !!! 
      // 
      // This call to SC._object_className will *absolutely* fail in IE 7 and 8 if the 
      // root object is not set up in the following way:
      //
      //   window.Foo = window.Foo || SC.Object.create();
      //
      var className = SC._object_className(this.constructor);
      matches = className.match(/\.(\w+)$/);
      if (SC.none(matches)) {
        SC.Logger.error('Mata.Visitable: unable to find matching class name for ' + this);
        SC.Logger.error('Mata.Visitable: confirm root object has been configured correctly');
        return;
      }
      visitValue = matches.pop();
    }
      
    var func = acceptFuncPrefix + visitValue;
    
    if (SC.empty(visitValue) || SC.empty(acceptFuncPrefix)) {
      SC.Logger.error('Mata.Visitable: was unable to construct an accept function name: ' + func);
      return;
    }

    // Now try calling the accept method on the visitor
    if (visitor.respondsTo(func)) {
      return visitor[func](this, context);
    } 
    
    // Visitor did not respond to the accept method. Therefore attempt a 
    // last resort: Try calling the unknown visited method on the visitor
    func = acceptFuncPrefix + Mata.UNKNOWN_VISITED_SUFFIX;
    if (visitor.respondsTo(func)) {
      return visitor[func](this, context);
    }
  }
  
};