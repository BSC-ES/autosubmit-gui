
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { authActions } from '../store/authSlice';

const AuthBadge = () => {
    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(authActions.reset())
    }, [])

    return (
        <>
            <div className='bg-info py-2 px-3 rounded-pill fw-bold'>
                {authState.user_id ?
                    <div>
                        {authState.user_id}
                    </div>
                    :
                    <div>
                        Login
                    </div>
                }
            </div>
        </>
    )
}

export default AuthBadge