import { OnlineStatusPipe } from './online-status.pipe';

describe('OnlineStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new OnlineStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
