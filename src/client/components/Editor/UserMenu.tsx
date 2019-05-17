import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Avatar from '../shared/Avatar';
import ContextMenu from '../shared/ContextMenu';
import { authTypes } from '../../features/auth';
// import withAuth, { AuthProps } from '../auth/withAuth';

type State = {
  visible: boolean;
};

type Props = authTypes.AuthProps & {
  onLogInClick: () => void;
};

class UserMenu extends React.Component<Props, State> {
  state = {
    visible: false,
    isLoggingIn: false,
  };

  componentDidMount() {
    document.addEventListener('click', this._handleDocumentClick);
    document.addEventListener('contextmenu', this._handleDocumentContextMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._handleDocumentClick);
    document.removeEventListener('contextmenu', this._handleDocumentContextMenu);
  }

  _handleDocumentClick = (e: MouseEvent) => {
    if (this.state.visible) {
      if (
        this._menu.current &&
        e.target !== this._menu.current &&
        !this._menu.current.contains(e.target as HTMLElement)
      ) {
        this._hideMenu();
      }
    } else if (
      this._avatar.current &&
      (e.target === this._avatar.current || this._avatar.current.contains(e.target as Node))
    ) {
      this.setState(state => ({ visible: !state.visible }));
    }
  };

  _handleDocumentContextMenu = () => {
    if (this.state.visible) {
      this._hideMenu();
    }
  };

  _hideMenu = () => this.setState({ visible: false });

  _menu = React.createRef<HTMLUListElement>();
  _avatar = React.createRef<HTMLButtonElement>();

  render() {
    const { loggedUser, logout } = this.props;

    return (
      <div className={css(styles.container)}>
        <button ref={this._avatar} className={css(styles.button)}>
          <Avatar
            source={loggedUser && loggedUser.picture ? loggedUser.picture : require('../assets/avatar.svg')}
            size={40}
          />
        </button>
        <ContextMenu
          ref={this._menu}
          visible={this.state.visible}
          actions={
            loggedUser
              ? [
                  {
                    label: 'View profile',
                    handler: () => window.open(`https://expo.io/@${loggedUser.username}/`),
                  },
                  {
                    label: 'View snacks',
                    handler: () => window.open(`https://expo.io/snacks/@${loggedUser.username}/`),
                  },
                  {
                    label: 'Edit account',
                    handler: () => window.open(`https://expo.io/settings/profile/`),
                  },
                  { label: 'Log out', handler: logout },
                ]
              : [
                  {
                    label: 'Log in',
                    handler: this.props.onLogInClick,
                  },
                ]
          }
          onHide={this._hideMenu}
          className={css(styles.menu)}
        />
      </div>
    );
  }
}

export default UserMenu/*withAuth(UserMenu)*/;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '0 16px 0 12px',
  },
  menu: {
    position: 'absolute',
    margin: '10px 0',
    right: 0,
    top: '100%',
  },
  button: {
    appearance: 'none',
    background: 'transparent',
    padding: 0,
    margin: 0,
    border: 0,
    outline: 0,
  },
});
