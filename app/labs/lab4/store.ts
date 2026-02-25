import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "./redux/hello/helloReducer";
import counterReducer from "./redux/CounterRedux/counterReducer";
const store = configureStore({
  reducer: {
    helloReducer,
    counterReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
