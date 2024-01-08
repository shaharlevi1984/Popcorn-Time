import { Grid, Header, Form, Segment, Button} from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { mutationLogin } from './mutation'

const Login = () => {   
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationKey: ['login'],mutationFn: mutationLogin, onSuccess: (data) => {
          localStorage.setItem('guest_session_id', data);
          navigate('/');
        },
      });
    
      const loginHandler = async () => {
        await mutate();
      };

    return (
        <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }}>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='violet' textAlign='center'>Welcome Back!</Header>
                <Form size='large'>
                    <Segment stacked>
                        <Button  color='violet' size='large' fluid onClick={loginHandler}> Login</Button>
                    </Segment>
                </Form>
            </Grid.Column>
        </Grid>
    )
}

export default Login