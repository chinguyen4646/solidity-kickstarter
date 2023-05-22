import React from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from '../routes';

const Header = (props) => {
  return (
    <Menu style={{marginTop: '10px'}}>
      <Link route="/">
        <a className="item">
          ChiCoin
        </a>
      </Link>
      <Menu.Menu position="right">
      </Menu.Menu>
      <Link route="/">
        <a className="item">
          Campaigns
        </a>
      </Link>
      <Link route="/campaigns/new">
        <a className="item">
          +
        </a>
      </Link>
    </Menu>
  );
};
export default Header;
