
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { authActions } from '../store/authSlice';

const AuthBadge = () => {
    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(authActions.reset())
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <button className='btn btn-light py-2 px-3 rounded-pill fw-bold shadow-sm'>
                {authState.user_id ?
                    <div>
                        {authState.user_id}
                    </div>
                    :
                    <div>
                        Login
                    </div>
                }
            </button>
        </>
    )
}

export default AuthBadge