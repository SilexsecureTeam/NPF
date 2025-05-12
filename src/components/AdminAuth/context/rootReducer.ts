import auth from "@/components/AdminAuth/store";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  auth,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
