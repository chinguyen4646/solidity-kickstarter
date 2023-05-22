import React from 'react';
import Layout from '../../../components/Layout';
import {Button, Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import getCampaignInstance from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends React.Component {
  static async getInitialProps (props) {
    const campaignAddress = props.query.campaignAddress;
    const campaign = await getCampaignInstance(campaignAddress);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    /*
     1. Array() constructor creates a new array instance. Length of new array determined by number passed in i.e. Array(2) -> [empty x2]
     2. .fill(value, startIndex, endIndex) (Array.prototype.fill()) method will change elements in array. If no arg passed in then array will be filled with undefined.
     3. .map() will then return elements and create a new array
    */
    const requests = await Promise.all(
      Array(parseInt(requestCount)).fill().map((element, index) => {
        return campaign.methods.requests(index).call();
      })
    );

    return {campaignAddress, requests, requestCount, approversCount};
  }

  renderRows () {
    const {requests, campaignAddress, approversCount} = this.props;

    return requests.map((request, index) => {
      return (
        <RequestRow
          id={index}
          key={index}
          request={request}
          campaignAddress={campaignAddress}
          approversCount={approversCount}
        />
      );
    });
  }

  render () {
    const {Header, Row, HeaderCell, Body} = Table;
    const {campaignAddress, requestCount} = this.props;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${campaignAddress}/requests/new`}>
          <a>
            <Button primary floated="right" style={{marginBottom: 10}}>Add Request</Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>
                ID
              </HeaderCell>
              <HeaderCell>
                Description
              </HeaderCell>
              <HeaderCell>
                Amount
              </HeaderCell>
              <HeaderCell>
                Recipient
              </HeaderCell>
              <HeaderCell>
                Approval
              </HeaderCell>
              <HeaderCell>
                Approve
              </HeaderCell>
              <HeaderCell>
                Finalise
              </HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRows()}
          </Body>
        </Table>
        <div>Found {requestCount} requests</div>
      </Layout>
    );
  }
}

export default RequestIndex;
