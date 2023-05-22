import React from 'react';
import {Table, Button, Message} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import getCampaignInstance from '../ethereum/campaign';
import {Router} from '../routes';

class RequestRow extends React.Component {
  state = {
    errorMessageFinalise: '',
    errorMessageApprove: '',
    loadingFinalise: false,
    loadingApprove: false
  };

  onApprove = async () => {
    const {campaignAddress, id} = this.props;

    this.setState({loadingApprove: true, errorMessageApprove: ''});

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await getCampaignInstance(campaignAddress);
      await campaign.methods.approveRequest(id).send({
        from: accounts[0]
      });

      Router.pushRoute(`/campaigns/${campaignAddress}/requests`);
    } catch (err) {
      this.setState({errorMessageApprove: err.message});
    }

    this.setState({loadingApprove: false});
  };

  onFinalise = async () => {
    const {campaignAddress, id} = this.props;

    this.setState({loadingFinalise: true, errorMessageFinalise: ''});

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await getCampaignInstance(campaignAddress);
      await campaign.methods.finaliseRequest(id).send({
        from: accounts[0]
      });

      Router.pushRoute(`/campaigns/${campaignAddress}/requests`);
    } catch (err) {
      this.setState({errorMessageFinalise: err.message});
    }

    this.setState({loadingFinalise: false});
  };

  render () {
    const {Row, Cell} = Table;
    const {id, request, approversCount} = this.props;
    const {loadingApprove, loadingFinalise, errorMessageApprove, errorMessageFinalise} = this.state;
    const readyToFinalise = request.approvalCount > (approversCount / 2);

    return (
      <Row disabled={request.complete} positive={readyToFinalise && !request.complete} negative={!readyToFinalise}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{`${request.approvalCount}/${approversCount}`}</Cell>
        <Cell>
          {!request.complete && (
            <Button color="green" basic onClick={this.onApprove} loading={loadingApprove}>Approve</Button>
          )}
          {!!errorMessageApprove && (
            <Message error header="Oops!" content={errorMessageApprove}/>
          )}
        </Cell>
        <Cell>
          {!request.complete && (
            <Button color="teal" basic onClick={this.onFinalise} loading={loadingFinalise}>Finalise</Button>
          )}
          {!!errorMessageFinalise && (
            <Message error header="Oops!" content={errorMessageFinalise}/>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
