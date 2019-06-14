/*
* @Author: Derek
* @Date:   2017-04-18 13:29:47
* @Last Modified by:   Derek
* @Last Modified time: 2017-04-18 13:30:21
*/

'use strict';
export default function ({ store, redirect, error }) {
  // If user not connected, redirect
  if (!store.state.isLoggedIn) {
    return redirect('/login')
    // error({
    //   message: 'You are not connected',
    //   statusCode: 403
    // })
  }
}
