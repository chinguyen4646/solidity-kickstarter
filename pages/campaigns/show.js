import React from 'react';
import {Card, Grid, Button} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import getCampaignInstance from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import {Link} from '../../routes';

class CampaignShow extends React.Component {
  static async getInitialProps (props) {
    const campaignAddress = props.query.campaignAddress;
    const campaign = getCampaignInstance(campaignAddress);

    const {
      0: minimumContribution,
      1: balance,
      2: requestsCount,
      3: approversCount,
      4: manager
    } = await campaign.methods.getSummary().call();

    return {
      campaignAddress,
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager
    };
  }

  renderCards () {
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
            'The manager created this campaign and can create requests to withdraw money',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
            'You must contribute this much wei to become an approver'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
            'A request tries to withdraw money from the contract. Requests must be approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description:
            'Number of people who have already donated to this campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description:
            'The balance is how much money this campaign has left to spend'
      }
    ];

    return (
      <Card.Group items={items} />
    );
  }

  render () {
    const {campaignAddress} = this.props;

    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm campaignAddress={campaignAddress} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${campaignAddress}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
