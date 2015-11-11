var isCalled = false;

var text = {
    scale : {
        setTo: function(){
            isCalled = true;
        }
    }
};

QUnit.module( "AbstractMenu" , {
    beforeEach:function(){
        isCalled = false;
    }
});




QUnit.test( "Test 'over' event", function( assert ){


    doodleBreakout.AbstractMenu.prototype.over(text);
    assert.equal( isCalled, true );
});

QUnit.test( "Test 'out' event", function( assert ){


    doodleBreakout.AbstractMenu.prototype.out(text);
    assert.equal( isCalled, true );
});

