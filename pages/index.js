import React from 'react';
import {Card, Button} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import {Link} from '../routes';

class CampaignIndex extends React.Component {
  static async getInitialProps () {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return {campaigns};
  }

  renderCampaigns () {
    const {campaigns} = this.props;

    const items = campaigns.map(campaignAddress => {
      return {
        header: campaignAddress,
        description: (
          <Link route={`/campaigns/${campaignAddress}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render () {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary
              />
            </a>
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
