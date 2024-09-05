import styles from './index.module.scss'
import logo from '../../assets/icons/logo.svg'
import { DownloadOutlined, MoonOutlined, ShareAltOutlined, SunOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { PlaygroundContext } from '../../ReactPlayground/PlaygroundContext';
import { message } from 'antd';
import copy from 'copy-to-clipboard'
import { downloadFiles } from '../../ReactPlayground/utils';


const Header: React.FC = () => {
  const {
    files,
    theme,
    setTheme
  } = useContext(PlaygroundContext)
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img alt='logo' src={logo} />
        <span>React Playground</span>
      </div>
      <div className={styles.links}>
        {theme === 'light' && (
          <MoonOutlined
            title='切换暗色主题'
            className={styles.theme}
            onClick={() => setTheme('dark')}
          />
        )}
        {theme === 'dark' && (
          <SunOutlined
            title='切换亮色主题'
            className={styles.theme}
            onClick={() => setTheme('light')}
          />
        )}
        <ShareAltOutlined
          className={styles.theme}
          style={{ marginLeft: '10px' }}
          onClick={() => {
            copy(window.location.href);
            message.success('分享链接已复制。')
          }}
        />
        <DownloadOutlined
          className={styles.theme}
          style={{ marginLeft: '10px' }}
          onClick={async () => {
            await downloadFiles(files);
            message.success('下载完成')
          }}
        />
      </div>
    </div>
  )
}

export default Header

