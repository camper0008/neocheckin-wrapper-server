import { State, States } from "./State";

describe('State', () => {

  it('should start ok', () => {
    const state = new State();
    expect(state.getState()).toBe(States.OK);
  })

});
