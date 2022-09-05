import { History } from 'history'
import * as React from 'react'
import {
    Grid,
    Image,
  Header,
  Card,
  Container,
  Message,
} from 'semantic-ui-react'
import { getAllInfos } from '../api/infos-api'
import Auth from '../auth/Auth'

import { Info } from '../types/Info'

interface PublicShostInfosProps {
  history: History
  auth: Auth
}

interface InfosState {
  infos: Info[]
  newInfoName: string
  loadingInfos: boolean
}

export class PublicShortInfos extends React.PureComponent<PublicShostInfosProps>
{
  state: InfosState = {
    infos: [],
    newInfoName: '',
    loadingInfos: true
  }

  

  render() {
    return (
      <div>
        <Header as="h1">Short Infos</Header>

        {this.renderShortInfos()}
      </div>
    )
  }

 
  renderShortInfos() {    

    return this.renderShortInfosList()
  }


  async componentDidMount() {
    try {
      const infos = await getAllInfos(this.props.auth.getIdToken())
      this.setState({
        infos,
        loadingInfos: false
      })
    } catch (e) {
      console.log(`There is no infos found for this user`)
      this.setState({
        infos: [],
        newInfoName: '',
        loadingInfos: false
      })
    }
  }

  renderShortInfosList() {


    return <Grid  padded>

    {this.state.infos.map((info, pos) => {

      console.log(pos)
      return( 
        <Grid.Row  key={info.infoId} textAlign='justified' >        
            <Card fluid>
              <Card.Content>     
              <Image
                  floated='left'
                  size='mini'
                  src='https://cdn-icons-png.flaticon.com/512/149/149071.png'
              />   
               <Card.Header>User-{info.userId?.substring(20, 14)}</Card.Header>       
                <Card.Meta>
                    <span className='date'>Posted at {info.dueDate}</span>
                </Card.Meta>
                <Card.Description>
                <Container fluid>
              <Header as='h2'></Header>
             
              <Message>
                <Message.Header>{info.name}</Message.Header>
                  <p>
                  {info.shortText}
                  </p>
              </Message>              
             
            
            </Container>
                </Card.Description>
                
                </Card.Content>
               
                <Card.Content extra>
                <Image src={info.attachmentUrl} size='large' circular  />                
                </Card.Content>             

            </Card>       
        </Grid.Row>  
        )
    })}
  </Grid>
  
  }
 

}
