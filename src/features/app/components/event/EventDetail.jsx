import React from 'react';
import { Link } from 'react-router';
import * as api from '../../../data/api';
import { Admission } from '../admission/Admission';
import { Expenses } from '../expenses/Expenses';
import { AdminFee } from '../adminfee/AdminFee';
import { Cashbox } from '../cashbox/Cashbox';
import { RemoveAdminFee } from './RemoveAdminFee';
import * as shared from '../../../data/shared';

const Loading = require('react-loading-animation');

export class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    api.fetchEventDetails(this.props.params.id);
  }
  handleClick(e) {
    if (this.props.disabled === true) {
      e.preventDefault();
    }
  }

  render() {
    const { role } = this.props.user;
    const userClass = () => {
      if (role === 'admin') {
        return 'admin';
      }
      return 'user';
    };
    const renderAdminFee = () => {
      const { fee } = this.props.event[0]; //eslint-disable-line
      const eventId = this.props.params.id;
      if (fee > 0 && this.props.disabled === false) {
        return (
          <div>
            <RemoveAdminFee eventId={eventId} />
            <AdminFee fee={fee} />
          </div>
        );
      } else if (fee > 0 && this.props.disabled === true) {
        return (
          <AdminFee fee={fee} />
        );
      }
      return true;
    };
    const disabledMessage = () => {
      if (this.props.disabled === true) {
        return (
          <h5 className="text-center disabled-message">Editing this event is disabled</h5>
        );
      }
      return true;
    };
    const renderEvent = () => {
      if (this.props.event.loading === true) {
        return (
          <Loading />
        );
      }
      if (this.props.event.loading === false) {
        const event = this.props.event[0];
        const eventId = this.props.params.id;
        let sortedExpenses;
        let totalExpenses;
        if (event.expenses) {
          sortedExpenses = shared.orderExpenses(event.expenses);
          totalExpenses = event.totalExpenses;
        } else {
          sortedExpenses = {};
          totalExpenses = 0;
        }
        return (
          <div>
            <h2 className="text-center page-header">
              {event.name} | {event.date}
            </h2>
            <div className={`${userClass()} text-center edit`}>
              <Link onClick={e => this.handleClick(e)} to={`events/${eventId}/edit`}>
                Edit Event
              </Link>
            </div>
            {disabledMessage()}
            <Admission
              userClass={userClass()}
              tickets={event.tickets}
              eventId={eventId}
              disabled={this.props.event.disabled}
              totalRevenue={event.totalRevenue}
              totalCount={event.totalCount}
            />
            {renderAdminFee()}
            <Expenses
              userClass={userClass()}
              expenses={sortedExpenses}
              eventId={eventId}
              disabled={this.props.event.disabled}
              totalExpenses={totalExpenses}
            />
            <Cashbox
              userClass={userClass()}
              cash={event.cash}
              endingCash={event.endingCash}
              net={event.net}
            />
          </div>
        );
      }
      return true;
    };
    return (
      <div>
        {renderEvent()}
      </div>
    );
  }
}

EventDetail.propTypes = {
  event: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
  }),
  user: React.PropTypes.shape({
    role: React.PropTypes.String,
  }),
  disabled: React.PropTypes.bool,
  params: React.PropTypes.shape({
    id: React.PropTypes.string,
  }),
};
