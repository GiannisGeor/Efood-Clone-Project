import { createSlice } from "@reduxjs/toolkit";

export const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressId: null,
    postalCode: null,
    address: null,
    floor: null,
    doorbellName: null,
  },
  reducers: {
    setFields: (state, action) => {
      const { addressId, postalCode, address, floor, doorbellName } =
        action.payload;
      state.addressId = addressId;
      state.postalCode = postalCode;
      state.address = address;
      state.floor = floor;
      state.doorbellName = doorbellName;
    },

    clearFields: (state) => {
      state.addressId = null;
      state.postalCode = null;
      state.address = null;
      state.floor = null;
      state.doorbellName = null;
    },
  },
});

export const { setFields, clearFields } = addressSlice.actions;

export default addressSlice.reducer;
