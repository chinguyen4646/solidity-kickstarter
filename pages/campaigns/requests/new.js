import React from 'react';
import {Form, Button, Message, Input} from 'semantic-ui-react';
import getCampaignInstance from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Link, Router} from '../../../routes';
import Layout from '../../../components/Layout';

class RequestNew extends React.Component {
  state = {
    etherValue: '',
    description: '',
    recipient: '',
    errorMessage: '',
    loading: false
  };

  static async getInitialProps (props) {
    const campaignAddress = props.query.campaignAddress;
    const campaign = getCampaignInstance(campaignAddress);

    return {
      campaign,
      campaignAddress
    };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const {description, etherValue, recipient} = this.state;
    const {campaign, campaignAddress} = this.props;

    this.setState({loading: true, errorMessage: ''});

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(etherValue, 'ether'), recipient)
        .send({
          from: accounts[0]
        });

      Router.pushRoute(`/campaigns/${campaignAddress}/requests`);
    } catch (err) {
      this.setState({errorMessage: err.message});
    }

    this.setState({loading: false});
  };

  render () {
    const {etherValue, description, recipient, errorMessage, loading} = this.state;
    const {campaignAddress} = this.props;

    return (
      <Layout>
        <Link route={`/campaigns/${campaignAddress}/requests`}>
          <a>
            Back
          </a>
        </Link>
        <h3>Create a request</h3>
        <Form error={!!errorMessage} onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Description</label>
            <Input
              label="description"
              labelPosition="right"
              onChange={event => this.setState({description: event.target.value})}
              value={description}
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              label="value in ether"
              labelPosition="right"
              onChange={event => this.setState({etherValue: event.target.value})}
              value={etherValue}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              label="recipient"
              labelPosition="right"
              onChange={event => this.setState({recipient: event.target.value})}
              value={recipient}
            />
          </Form.Field>
          <Message error header="Oops!" content={errorMessage}/>
          <Button primary type="submit" loading={loading}>Create</Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
