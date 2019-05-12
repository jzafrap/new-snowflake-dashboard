import React, { useState } from 'react';
import {
  Nav,
  NavItem,
  NavLink,
  Button,
} from 'reactstrap';
import {
  NavLink as RouterNavLink,
} from 'react-router-dom';
import {
  useWeb3Context,
} from 'web3-react';

import Onboarding from '../onboarding';
import CategoriesMenu from './categoriesMenu';

import {
  getAccountEin,
} from '../../services/utilities';

function Sidebar() {
  const [hasProvider, setHasProvider] = useState(false);
  const [hasEin, setHasEin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const web3 = useWeb3Context();

  if (web3.active) {
    if (!hasProvider) {
      setHasProvider(true);
    }

    if (!hasEin) {
      getAccountEin(web3.library, web3.account)
        .then((res) => {
          if (res !== '') {
            setHasEin(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <div className="sidebar">
      <div className="py-4">
        <Nav vertical>
          {hasEin ? (
            <div>
              <NavItem>
                <NavLink tag={RouterNavLink} exact to="/" className="sidebar__link" activeClassName="sidebar__link--active">
                  Snowflake Store
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RouterNavLink} exact to="/wallet" className="sidebar__link" activeClassName="sidebar__link--active">
                  Your Wallet
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RouterNavLink} exact to="/manage" className="sidebar__link" activeClassName="sidebar__link--active">
                  Your dApps
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RouterNavLink} exact to="/identity" className="sidebar__link" activeClassName="sidebar__link--active">
                  Manage Your Identity (EIN)
                </NavLink>
              </NavItem>
            </div>
          ) : (
            <div>
              <Onboarding
                step={hasProvider ? 'provider' : 'hydroId'}
                isOpen={isModalOpen}
                toggle={() => setIsModalOpen(false)}
              />
              <Button color="primary" onClick={() => setIsModalOpen(!isModalOpen)}>
                Create Account
              </Button>
            </div>
          )}
          <NavItem>
            <NavLink tag={RouterNavLink} exact to="/submit" className="sidebar__link" activeClassName="sidebar__link--active">
              Submit your dApp
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <div className="py-4">
        <CategoriesMenu />
      </div>
    </div>
  );
}

export default Sidebar;
