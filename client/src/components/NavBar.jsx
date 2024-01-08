import {Button, Menu} from 'semantic-ui-react'
import {Link,useNavigate} from 'react-router-dom'

const NavBar = () => {
  const isLoggedIn = localStorage.getItem('guest_session_id') !== null;
  const navigate = useNavigate()
  
  const logout = () => {
    localStorage.removeItem('guest_session_id')
    navigate('/login')
  }
  return (
    <Menu fixed='top' size='huge'>
        <Menu.Menu position='left'>
            <Menu.Item as={Link} to="/" style={{fontSize: '1.2rem'}}> Home</Menu.Item> 
        </Menu.Menu>

        <Menu.Menu position='right'>
          <Menu.Item as={Link} to='/admin' style={{fontSize: '1.2rem'}} > Admin </Menu.Item> 
            {isLoggedIn ? (
              <Menu.Item as={Button} style={{fontSize: '1.2rem'}} onClick={logout}>  Logout </Menu.Item> 
            ) : (
              <Menu.Item as={Link} to='/login' style={{fontSize: '1.2rem'}} > Login </Menu.Item> 
            )}
            
        </Menu.Menu>
    </Menu>
  )
}

export default NavBar