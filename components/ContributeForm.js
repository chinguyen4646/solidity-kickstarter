import React from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import getCampaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

class ContributeForm extends React.Component {
  state = {
    contribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const {contribution} = this.state;
    const {campaignAddress} = this.props;
    const campaign = getCampaignInstance(campaignAddress);

    this.setState({loading: true, errorMessage: ''});

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(contribution, 'ether')
        });

      Router.replaceRoute(`/campaigns/${campaignAddress}`);
    } catch (err) {
      this.setState({errorMessage: err.message});
    }

    this.setState({loading: false});
  };

  render () {
    const {errorMessage, contribution, loading} = this.state;

    return (
      <Form error={!!errorMessage} onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            onChange={event => this.setState({contribution: event.target.value})}
            value={contribution}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage}/>
        <Button primary type="submit" loading={loading}>Contribute</Button>
      </Form>
    );
  }
}

export default ContributeForm;
