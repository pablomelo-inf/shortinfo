import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form
} from 'semantic-ui-react'

import { createInfo, deleteInfo, getInfos, patchInfo } from '../api/infos-api'
import Auth from '../auth/Auth'
import { Info } from '../types/Info'

interface InfosProps {
  auth: Auth
  history: History
}

interface InfosState {
  infos: Info[]
  newInfoName: string
  newShortText: string
  loadingInfos: boolean
}

export class Infos extends React.PureComponent<InfosProps, InfosState> {
  state: InfosState = {
    infos: [],
    newInfoName: '',
    newShortText: '',
    loadingInfos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newInfoName: event.target.value  })
  }

  handleShortTextChange= (event: React.ChangeEvent<HTMLInputElement>)  => {
    this.setState({ newShortText: event.target.value })
  }





  onEditButtonClick = (infoId: string) => {
    this.props.history.push(`/infos/${infoId}/edit`)
  }

  onInfoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {

      if (!this.state.newInfoName) {
        alert('Type name task. Please!')
        return         
      }
      
      const dueDate = this.calculateDueDate()
      const newInfo = await createInfo(this.props.auth.getIdToken(), {
        name: this.state.newInfoName,
        shortText: this.state.newShortText,
        dueDate
      })
      console.log(newInfo)
      this.setState({
        infos: [...this.state.infos, newInfo],
        newInfoName: '',
        newShortText: ''
      })
    } catch (e){
      console.log(e)
    }
  }

  onInfoDelete = async (infoId: string) => {
    try {
      await deleteInfo(this.props.auth.getIdToken(), infoId)
      this.setState({
        infos: this.state.infos.filter(info => info.infoId !== infoId)
      })
    } catch {
      alert('Info deletion failed')
    }
  }

  onInfoCheck = async (pos: number) => {
    try {
      const info = this.state.infos[pos]
      await patchInfo(this.props.auth.getIdToken(), info.infoId, {
        name: info.name,
        dueDate: info.dueDate,
        done: !info.done
      })
      this.setState({
        infos: update(this.state.infos, {
          [pos]: { done: { $set: !info.done } }
        })
      })
    } catch {
      alert('Info deletion failed')
    }
  }
 

  



  async componentDidMount() {
    try {
      const infos = await getInfos(this.props.auth.getIdToken())
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

  render() {
    return (
      <div>
        <Header as="h1">My Short Infos</Header>
       
       
        {this.renderCreateInfoInput()}

        {this.renderInfos()}
      </div>
    )
  }

  renderCreateInfoInput() {
    return (
     
      <Grid.Row>
        <Grid.Column width={16}>

            <Form>
              <Form.Field>
                <label>Type a Short Info</label>
                <Input  placeholder='Tell us more' onChange={this.handleShortTextChange} />
              </Form.Field>

              <Form.Field>
                <label>Type a title Info</label>
                <Input 
                action={{
                  color: 'teal',
                  labelPosition: 'left',
                  icon: 'add',
                  content: 'ADD INFO',
                  onClick: this.onInfoCreate
                }}           
                fluid
                actionPosition="left"
                placeholder="To to add news"
                onChange={this.handleNameChange}
              />

              </Form.Field>          
            </Form>
          <Divider />
        </Grid.Column>
      </Grid.Row>
      
    )
  }

  renderInfos() {
    if (this.state.loadingInfos) {
      return this.renderLoading()
    }

    return this.renderInfosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderInfosList() {

   
    

    return (
      <Grid padded>
        {this.state.infos.map((info, pos) => {
          return (
            <Grid.Row key={info.infoId}>             
              <Grid.Column width={10} verticalAlign="middle">
                {info.name}
              </Grid.Column>
            
              <Grid.Column width={3} floated="right">
                {info.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(info.infoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onInfoDelete(info.infoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {info.attachmentUrl && (
                <Image src={info.attachmentUrl} size="small" wrapped />
              )}

              <Grid.Column width={10} verticalAlign="middle">
                {info.shortText}
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
