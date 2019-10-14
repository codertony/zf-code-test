import {createStore} from '../redux';
import reducer from './reducer';


/**
 * 1. 希望可以方便对仓库进行扩展
 * 2. 可以支持添加多个中间件
 */
/**
 * let dispatch = store.dispatch;
store.dispatch = function(action){
   console.log('老状态 ',store.getState());
   dispatch(action);
   console.log('新状态 ',store.getState());
}
*/
// 获取仓库状态  派发动作 调用下一个中间 action
let logger1 = function({dispatch,getState}){
   return function(next){
      return function(action){
        console.log('老状态1 ',getState());
        next(action);//派发动作
        console.log('新状态1 ',getState());}
    }
}
let applyMiddleware  = function(middleware){//middleware 是应用的中间件  createStore用来创建仓库 reducer
    return function (createStore){
        return function(reducer){
            let store = createStore(reducer);
            let dispatch;
            let middlewareAPI = {
                getState:store.getState,
                dispatch:action=>dispatch(action)
            }
            middleware = middleware(middlewareAPI);
            dispatch = middleware(store.dispatch);
            return {...store,dispatch};
        }
    }
}
let store = applyMiddleware(logger)(createStore)(reducer);
window.store = store;
export default store;