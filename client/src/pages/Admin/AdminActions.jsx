import { Navigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { DisplayTypes } from '.'

const AdminActions = ({ displayType, setDisplayType}) => {

    if (localStorage.getItem('guest_session_id') === null) {
        return <Navigate to='/login' />
    }

    return (
        <>
            <Button.Group>
                <Button
                    style={{ marginLeft: 5 }}
                    color={displayType === DisplayTypes.Movies ? 'blue' : undefined}
                    onClick={() => setDisplayType(DisplayTypes.Movies)}> Add Movie
                </Button>
                <Button
                    style={{ marginLeft: 5 }}
                    color={displayType === DisplayTypes.TvShows ? 'blue' : undefined}
                    onClick={() => setDisplayType(DisplayTypes.TvShows)}> Add TvShow
                </Button>
                <Button
                    style={{ marginLeft: 5 }}
                    color={displayType === DisplayTypes.Comments ? 'blue' : undefined}
                    onClick={() => setDisplayType(DisplayTypes.Comments)}> Aprove Comment
                </Button>
            </Button.Group>
        </>
    )
}

export default AdminActions