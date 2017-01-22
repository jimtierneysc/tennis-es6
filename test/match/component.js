/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {MatchComponent, MatchComponentList} from '../../src/match/component'

class SampleComponent extends MatchComponent {
}

class SampleComponentList extends MatchComponentList {
    factory(owner, value) {
        return new SampleComponent(owner, value);
    }
}

describe('component', () => {

    describe('constructor', () => {
        describe('owner', () => {
            let component;
            describe('undefined', () => {
                beforeEach(() => {
                    component = new SampleComponent();
                });

                it('should be undefined', () => {
                    expect(component.owner).not.to.exist;

                });
            });

            describe('defined', () => {
                let owner;
                beforeEach(() => {
                    owner = new SampleComponent();
                    component = new SampleComponent(owner);
                });

                it('should be defined', () => {
                    expect(component.owner).to.exist;
                });

                it('should not have parent', () => {
                    expect(component.parent).not.to.exist;
                });
            });
        });

        describe('parent', () => {
            let component;
            describe('undefined', () => {
                beforeEach(() => {
                    component = new SampleComponent();
                });

                it('should be undefined', () => {
                    expect(component.parent).not.to.exist;
                });
            });

            describe('defined', () => {
                let parent;
                beforeEach(() => {
                    parent = new SampleComponentList();
                    component = new SampleComponent(parent);
                });

                it('should be defined', () => {
                    expect(component.parent).to.exist;
                });
            });
        });
    });

    describe('value', () => {
        let component;
        describe('undefined', () => {
            beforeEach(() => {
                component = new SampleComponent();
            });

            it('should default to {}', () => {
                expect(component.value).to.eql({});
            });
        });

        describe('defined', () => {
            beforeEach(() => {
                component = new SampleComponent(undefined, 10);
            });

            it('should be defined', () => {
                expect(component.value).to.be.equal(10);
            });
        });
    });

    describe('init', () => {
        let component;
        beforeEach(() => {
            component = new SampleComponent();
        });
        describe('initArray', () => {
            beforeEach(() => {
                component.initArray('member');
            });
            it('should set value', () => {
                expect(component.value.member).to.be.eql([]);
            });
        });

        describe('initObject', () => {
            beforeEach(() => {
                component.initObj('member');
            });
            it('should set value', () => {
                expect(component.value.member).to.be.eql({});
            });
        });

        describe('initValue', () => {
            beforeEach(() => {
                component.initValue('member', 10);
            });
            it('should set value', () => {
                expect(component.value.member).to.be.equal(10);
            });
        });
    });

    describe('isEqualValue', () => {
        let component;
        describe('simple', () => {
            beforeEach(() => {
                component = new SampleComponent(undefined, 10);
            });
            it('should be equal', () => {
                expect(component.isEqualValue(10)).to.be.true;

            });
            it('should not be equal', () => {
                expect(component.isEqualValue(11)).not.to.be.true;
            });
        });
        describe('deep', () => {
            beforeEach(() => {
                component = new SampleComponent(undefined, [1, {a: 'b'}]);
            });
            it('should be equal', () => {
                expect(component.isEqualValue([1, {a: 'b'}])).to.be.true;

            });
            it('should not be equal', () => {
                expect(component.isEqualValue(11)).not.to.be.true;
            });
        });
    });

    describe('index', () => {
        let component;
        let list;
        beforeEach(() => {
            list = new SampleComponentList();
        });

        describe('not in list', () => {
            beforeEach(() => {
                component = new SampleComponent(list);
            });

            it('should not have index', () => {
                expect(component.index).to.be.equal(0);
            });
        });

        describe('first', () => {
            beforeEach(() => {
                component = new SampleComponent(list);
            });

            it('should not have index', () => {
                expect(component.index).to.be.equal(0);

            });
        });

        describe('second', () => {
            beforeEach(() => {
                new SampleComponent(list);
                component = new SampleComponent(list);
            });

            it('should not have index', () => {
                expect(component.index).to.be.equal(1);
            });
        });
    });

});

describe('component-list', () => {
    describe('addChild', () => {
        let list;
        beforeEach(() => {
            list = new SampleComponentList();
        });

        describe('add-one', () => {
            beforeEach(() => {
                list.addChild(new SampleComponent());
            });

            it('should have one', () => {
                expect(list.count).to.be.equal(1);
            });
        });

        describe('add-two', () => {
            beforeEach(() => {
                list.addChild(new SampleComponent(undefined, 1));
                list.addChild(new SampleComponent(undefined, 2));
            });

            it('should have two', () => {
                expect(list.count).to.be.equal(2);
            });
        });

        describe('move-child', () => {
            let listFrom;
            let component;
            beforeEach(() => {
                listFrom = new SampleComponentList();
                component = new SampleComponent();
                listFrom.addChild(component);
                list.addChild(component);
            });

            it('should add one', () => {
                expect(list.count).to.be.equal(1);
            });

            it('should contain component', () => {
                expect(list.contains(component)).to.be.true;
            });

            it('should reduce count', () => {
                expect(listFrom.count).to.be.equal(0);
            });

        });

    });

    describe('removeChild', () => {
        let list;
        let component;
        beforeEach(() => {
            list = new SampleComponentList();
            component = new SampleComponent();
        });

        describe('remove-existing', () => {
            beforeEach(() => {
                list.addChild(component);
                list.removeChild(component);
            });

            it('should reduce count', () => {
                expect(list.count).to.be.equal(0);
            });

            it('should remove item', () => {
                expect(list.contains(component)).not.to.be.true;
            });

        });
    });

    describe('add', () => {
        describe('no-factory', () => {
            let list;
            beforeEach(() => {
                list = new MatchComponentList();
            });

            it('should throw error', () => {
                expect(() => list.add()).to.throw;
            })

        });

        describe('with-factory', () => {
            let list;
            beforeEach(() => {
                list = new SampleComponentList();
            });

            it('should not throw error', () => {
                expect(() => list.add()).not.to.throw;
            });

            it('should add one', () => {
                list.add();
                expect(list.count).to.be.equal(1);
            });
        });
    });

    describe('last', () => {
        let list;
        let component;
        beforeEach(() => {
            list = new SampleComponentList();
            component = new SampleComponent();
        });

        describe('undefined', () => {
            it('should not have last', () => {
                expect(list.last).not.to.exist;
            });
        });

        describe('defined', () => {
            beforeEach(() => {
                component = new SampleComponent();
                list.addChild(new SampleComponent());
                list.addChild(component);
            });

            it('should have last', () => {
                expect(list.last).to.be.equal(component);
            });
        });
    });

    describe('removeLast', () => {
        let list;
        let component;
        beforeEach(() => {
            list = new SampleComponentList();
            component = new SampleComponent();
        });

        describe('remove-existing', () => {
            beforeEach(() => {
                list.add();
                list.addChild(component);
                list.removeLast();
            });

            it('should reduce count', () => {
                expect(list.count).to.be.equal(1);
            });

            it('should remove item', () => {
                expect(list.contains(component)).not.to.be.true;
            });

        });
    });

    describe('value-array', () => {
        let list;

        describe('create', () => {
            beforeEach(() => {
                list = new SampleComponentList(undefined, [1, 2, 2]);
            });

            it('should have value length', () => {
                expect(list.value.length).to.be.equal(3);
            });

            it('should have change value length', () => {
                expect(list.value).to.be.eql([1, 2, 2]);
            });

        });


        describe('remove', () => {
            beforeEach(() => {
                list = new SampleComponentList(undefined, [1, 2, 3]);
                list.removeLast();
            });


            it('should have value length', () => {
                expect(list.value.length).to.be.equal(2);
            });

            it('should have change value length', () => {
                expect(list.value).to.be.eql([1, 2]);
            });

        });

        describe('add', () => {
            beforeEach(() => {
                list = new SampleComponentList();
            });


            describe('add-unique', () => {
                beforeEach(() => {
                    [1, 2, 3].forEach((i) => new SampleComponent(list, i));
                });

                it('should have value length', () => {
                    expect(list.value.length).to.be.equal(3);
                });

                it('should have change value length', () => {
                    expect(list.value).to.be.eql([1, 2, 3]);
                });

            });

            describe('add-duplicate', () => {
                beforeEach(() => {
                    [1, 1, 1].forEach((i) => new SampleComponent(list, i));
                });

                it('should have value length', () => {
                    expect(list.value.length).to.be.equal(3);
                });

                it('should have change value length', () => {
                    expect(list.value).to.be.eql([1, 1, 1]);
                });
            });
        });
    });

    describe('iterator', () => {

        let list;
        let values;

        describe('no-values', () => {
            beforeEach(() => {
                list = new SampleComponentList();
                values = [...list[Symbol.iterator]];
            });
            it('should not have values', () => {
                expect(values).to.be.eql([]);
            })
        });

        describe('array', () => {
            let component1;
            let component2;
            beforeEach(() => {
                list = new SampleComponentList();
                component1 = new SampleComponent(list);
                component2 = new SampleComponent(list);
                values = [...list[Symbol.iterator]()];
            });

            it('should have length', () => {
                expect(values.length).to.be.eql(2);
            });

            it('should have first', () => {
                expect(values[0]).to.be.equal(component1);
            });

            it('should have second', () => {
                expect(values[1]).to.be.equal(component2);
            })
        })
    })
})
