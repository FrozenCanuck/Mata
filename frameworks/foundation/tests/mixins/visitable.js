// ========================================================================
// Mata.Visitable Tests
// ========================================================================
/*globals Mata MyApp*/

window.MyApp = null;
var foo, bar, mah, abc, xyz, add, subtract, multiply, visitor;

module("Visitable Tests", {
  
  setup: function() {
    MyApp = SC.Object.create();
    MyApp.Thing = SC.Object.extend(Mata.Visitable);
    MyApp.Foo = MyApp.Thing.extend();
    MyApp.Bar = MyApp.Thing.extend();
    MyApp.Mah = MyApp.Thing.extend();
    
    MyApp.Stuff = SC.Object.extend(Mata.Visitable, {
      visitorAcceptFunctionPrefix: '__accept'
    });
    MyApp.Abc = MyApp.Stuff.extend();
    MyApp.Xyz = MyApp.Stuff.extend();
    
    MyApp.Operator = SC.Object.extend(Mata.Visitable, {
      visitKey: 'value',
      value: null
    });
    
    // Explicitly set the class name so that the type is
    // recognized for each test run. If not done then the
    // type defaults back to 'SC.Object' after the first
    // unit test is run. This also prevents the findClassNames
    // from being constantly invoked since it is an expensive 
    // operation.
    MyApp.Foo._object_className = 'MyApp.Foo';
    MyApp.Bar._object_className = 'MyApp.Bar';
    MyApp.Mah._object_className = 'MyApp.Mah';
    MyApp.Abc._object_className = 'MyApp.Abc';
    MyApp.Xyz._object_className = 'MyApp.Xyz';
    MyApp.Operator._object_className = 'MyApp.Operator';
    
    foo = MyApp.Foo.create();
    bar = MyApp.Bar.create();
    mah = MyApp.Mah.create();
    
    abc = MyApp.Abc.create();
    xyz = MyApp.Xyz.create();
    
    add = MyApp.Operator.create({ value: 'add' });
    subtract = MyApp.Operator.create({ value: 'subtract' });
    multiply = MyApp.Operator.create({ value: 'multiply' });
 
    visitor = SC.Object.create({
      visited: null,
      acceptMethodInvoked: null,
      context: null,
      
      acceptFoo: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptFoo');
        this.set('context', context);
      },
      
      acceptBar: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptBar');
        this.set('context', context);
      },
      
      acceptUnknownVisited: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptUnknownVisited');
        this.set('context', context);
      },
      
      acceptThingFoo: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptThingFoo');
        this.set('context', context);
      },
      
      acceptThingBar: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptThingBar');
        this.set('context', context);
      },
      
      acceptThingUnknownVisited: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptThingUnknownVisited');
        this.set('context', context);
      },
      
      __acceptAbc: function(stuff, context) {
        this.set('visited', stuff);
        this.set('acceptMethodInvoked', '__acceptAbc');
        this.set('context', context);
      },
      
      __acceptStuffAbc: function(stuff, context) {
        this.set('visited', stuff);
        this.set('acceptMethodInvoked', '__acceptStuffAbc');
        this.set('context', context);
      },
      
      __acceptUnknownVisited: function(stuff, context) {
        this.set('visited', stuff);
        this.set('acceptMethodInvoked', '__acceptUnknownVisited');
        this.set('context', context);
      },
      
      __acceptStuffUnknownVisited: function(stuff, context) {
        this.set('visited', stuff);
        this.set('acceptMethodInvoked', '__acceptStuffUnknownVisited');
        this.set('context', context);
      },
      
      acceptAdd: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptAdd');
        this.set('context', context);
      },
      
      acceptSubtract: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptSubtract');
        this.set('context', context);
      },
      
      acceptUnknownVisited: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptUnknownVisited');
        this.set('context', context);
      },

      acceptOperatorAdd: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptOperatorAdd');
        this.set('context', context);
      },
      
      acceptOperatorSubtract: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptOperatorSubtract');
        this.set('context', context);
      },
      
      acceptOperatorUnknownVisited: function(thing, context) {
        this.set('visited', thing);
        this.set('acceptMethodInvoked', 'acceptOperatorUnknownVisited');
        this.set('context', context);
      }
    });
  },
  
  teardown: function() { 
    window.MyApp = foo = bar = abc = xyz = add = subtract = multiply = visitor = null;
  }
  
});
  
test("visit foo by type - invoke acceptFoo", function() {
  foo.visit(visitor);
  equals(visitor.get('visited'), foo);
  equals(visitor.get('acceptMethodInvoked'), 'acceptFoo');
  equals(visitor.get('context'), undefined);
});

test("visit bar by type - invoke acceptBar", function() {
  bar.visit(visitor);
  equals(visitor.get('visited'), bar);
  equals(visitor.get('acceptMethodInvoked'), 'acceptBar');
  equals(visitor.get('context'), undefined);
});

test("visit mah by type - invoke acceptUnknownVisited", function() {
  mah.visit(visitor);
  equals(visitor.get('visited'), mah);
  equals(visitor.get('acceptMethodInvoked'), 'acceptUnknownVisited');
  equals(visitor.get('context'), undefined);
});

test("visit foo by type w/ accept prefix - invoke acceptThingFoo", function() {
  foo.visit(visitor, 'acceptThing');
  equals(visitor.get('visited'), foo);
  equals(visitor.get('acceptMethodInvoked'), 'acceptThingFoo');
  equals(visitor.get('context'), undefined);
});

test("visit bar by type w/ accept prefix - invoke acceptThingBar", function() {
  bar.visit(visitor, 'acceptThing');
  equals(visitor.get('visited'), bar);
  equals(visitor.get('acceptMethodInvoked'), 'acceptThingBar');
  equals(visitor.get('context'), undefined);
});

test("visit mah by type w/ accept prefix - invoke acceptThingUnknownVisited", function() {
  mah.visit(visitor, 'acceptThing');
  equals(visitor.get('visited'), mah);
  equals(visitor.get('acceptMethodInvoked'), 'acceptThingUnknownVisited');
  equals(visitor.get('context'), undefined);
});

test("visit foo by type w/ context - invoke acceptFoo", function() {
  var context = { value: 100 };  
  foo.visit(visitor, context);
  equals(visitor.get('visited'), foo);
  equals(visitor.get('acceptMethodInvoked'), 'acceptFoo');
  equals(visitor.get('context'), context);
});

test("visit bar by type w/ context - invoke acceptBar", function() {
  var context = { value: 100 };
  bar.visit(visitor, context);
  equals(visitor.get('visited'), bar);
  equals(visitor.get('acceptMethodInvoked'), 'acceptBar');
  equals(visitor.get('context'), context);
});

test("visit mah by type w/ context - invoke acceptUnknownVisited", function() {
  var context = { value: 100 };
  mah.visit(visitor, context);
  equals(visitor.get('visited'), mah);
  equals(visitor.get('acceptMethodInvoked'), 'acceptUnknownVisited');
  equals(visitor.get('context'), context);
});

test("visit foo by type w/ accept prefix and context - invoke acceptThingFoo", function() {
  var context = { value: 100 };  
  foo.visit(visitor, 'acceptThing', context);
  equals(visitor.get('visited'), foo);
  equals(visitor.get('acceptMethodInvoked'), 'acceptThingFoo');
  equals(visitor.get('context'), context);
});

test("visit bar by type w/ accept prefix and context - invoke acceptThingBar", function() {
  var context = { value: 100 };
  bar.visit(visitor, 'acceptThing', context);
  equals(visitor.get('visited'), bar);
  equals(visitor.get('acceptMethodInvoked'), 'acceptThingBar');
  equals(visitor.get('context'), context);
});

test("visit mah by type w/ accept prefix and context - invoke acceptThingUnknownVisited", function() {
  var context = { value: 100 };
  mah.visit(visitor, 'acceptThing', context);
  equals(visitor.get('visited'), mah);
  equals(visitor.get('acceptMethodInvoked'), 'acceptThingUnknownVisited');
  equals(visitor.get('context'), context);
});

test("visit add by property - invoke acceptAdd", function() {
  add.visit(visitor);
  equals(visitor.get('visited'), add);
  equals(visitor.get('acceptMethodInvoked'), 'acceptAdd');
  equals(visitor.get('context'), undefined);
});

test("visit subtract by property - invoke acceptSubtract", function() {
  subtract.visit(visitor);
  equals(visitor.get('visited'), subtract);
  equals(visitor.get('acceptMethodInvoked'), 'acceptSubtract');
  equals(visitor.get('context'), undefined);
});

test("visit multiply by property - invoke acceptUnknownVisited", function() {
  multiply.visit(visitor);
  equals(visitor.get('visited'), multiply);
  equals(visitor.get('acceptMethodInvoked'), 'acceptUnknownVisited');
  equals(visitor.get('context'), undefined);
});

test("visit add by property w/ accept prefix - invoke acceptOperatorAdd", function() {
  add.visit(visitor, 'acceptOperator');
  equals(visitor.get('visited'), add);
  equals(visitor.get('acceptMethodInvoked'), 'acceptOperatorAdd');
  equals(visitor.get('context'), undefined);
});

test("visit subtract by property w/ accept prefix - invoke acceptOperatorSubtract", function() {
  subtract.visit(visitor, 'acceptOperator');
  equals(visitor.get('visited'), subtract);
  equals(visitor.get('acceptMethodInvoked'), 'acceptOperatorSubtract');
  equals(visitor.get('context'), undefined);
});

test("visit multiply by property w/ accept prefix - invoke acceptOperatorUnknownVisited", function() {
  multiply.visit(visitor, 'acceptOperator');
  equals(visitor.get('visited'), multiply);
  equals(visitor.get('acceptMethodInvoked'), 'acceptOperatorUnknownVisited');
  equals(visitor.get('context'), undefined);
});

test("visit add by property w/ accept prefix and context - invoke acceptOperatorAdd", function() {
  var context = { value: 100 };
  add.visit(visitor, 'acceptOperator', context);
  equals(visitor.get('visited'), add);
  equals(visitor.get('acceptMethodInvoked'), 'acceptOperatorAdd');
  equals(visitor.get('context'), context);
});

test("visit subtract by property w/ accept prefix and context - invoke acceptOperatorSubtract", function() {
  var context = { value: 100 };
  subtract.visit(visitor, 'acceptOperator', context);
  equals(visitor.get('visited'), subtract);
  equals(visitor.get('acceptMethodInvoked'), 'acceptOperatorSubtract');
  equals(visitor.get('context'), context);
});

test("visit multiply by property w/ accept prefix and context - invoke acceptOperatorUnknownVisited", function() {
  var context = { value: 100 };
  multiply.visit(visitor, 'acceptOperator', context);
  equals(visitor.get('visited'), multiply);
  equals(visitor.get('acceptMethodInvoked'), 'acceptOperatorUnknownVisited');
  equals(visitor.get('context'), context);
});

test("visit abc - invoke __acceptAbc", function() {
  abc.visit(visitor);
  equals(visitor.get('visited'), abc);
  equals(visitor.get('acceptMethodInvoked'), '__acceptAbc');
});

test("visit abc w/ accept prefix - invoke __acceptStuffAbc", function() {
  abc.visit(visitor, '__acceptStuff');
  equals(visitor.get('visited'), abc);
  equals(visitor.get('acceptMethodInvoked'), '__acceptStuffAbc');
  equals(visitor.get('context'), undefined);
});

test("visit abc w/ accept prefix and context - invoke __acceptStuffAbc", function() {
  var context = { value: 100 };
  abc.visit(visitor, '__acceptStuff', context);
  equals(visitor.get('visited'), abc);
  equals(visitor.get('acceptMethodInvoked'), '__acceptStuffAbc');
  equals(visitor.get('context'), context);
});

test("visit xyz - invoke __acceptUnknownVisited", function() {
  xyz.visit(visitor);
  equals(visitor.get('visited'), xyz);
  equals(visitor.get('acceptMethodInvoked'), '__acceptUnknownVisited');
  equals(visitor.get('context'), undefined);
});

test("visit xyz w/ accept prefix - invoke __acceptStuffUnknownVisited", function() {
  xyz.visit(visitor, '__acceptStuff');
  equals(visitor.get('visited'), xyz);
  equals(visitor.get('acceptMethodInvoked'), '__acceptStuffUnknownVisited');
  equals(visitor.get('context'), undefined);
});

test("visit xyz w/ accept prefix and context - invoke __acceptStuffUnknownVisited", function() {
  var context = { value: 100 };
  xyz.visit(visitor, '__acceptStuff', context);
  equals(visitor.get('visited'), xyz);
  equals(visitor.get('acceptMethodInvoked'), '__acceptStuffUnknownVisited');
  equals(visitor.get('context'), context);
});