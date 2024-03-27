import { model } from '@modern-js/runtime/model';

interface State {
  fileName: string;
  bytes: Uint8Array;
}

export const INesRomModel = model<State>('ines-rom').define({
  state: {
    fileName: '',
    bytes: Uint8Array.of(),
  },
  computed: {
    length: state => {
      return state.bytes.length;
    },
    header: state => {
      if (state.bytes.length < 16) {
        return undefined;
      }
      return state.bytes.subarray(0, 16);
    },
    version: state => {
      if (state.bytes.length < 16) {
        return undefined;
      }
      const value = (state.bytes[7] & 0x0c) >> 2;
      return value;
    },
  },
});
