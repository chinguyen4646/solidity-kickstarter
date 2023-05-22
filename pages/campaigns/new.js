import React from 'react';
import Layout from '../../components/Layout';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';

class CampaignNew extends React.Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const {minimumContribution} = this.state;

    this.setState({loading: true, errorMessage: ''});

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(minimumContribution)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({errorMessage: err.message});
    }

    this.setState({loading: false});
  };

  render () {
    const {errorMessage, minimumContribution, loading} = this.state;

    return (
      <Layout>
        <h3>Create a campaign</h3>
        <Form error={!!errorMessage} onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Minimum contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              onChange={event => this.setState({minimumContribution: event.target.value})}
              value={minimumContribution}
            />
          </Form.Field>
          <Message error header="Oops!" content={errorMessage}/>
          <Button primary type="submit" loading={loading}>Create</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
