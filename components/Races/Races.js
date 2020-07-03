import {useContext} from 'react';
import UserContext from '../../components/UserContext';
import moment from 'moment'
import Race from '../../components/Race/Race';
import styles from './Races.module.scss'
import useTranslation from 'next-translate/useTranslation'

const Races = (props) => {
    const {t} = useTranslation()

    let {timezone} = useContext(UserContext)
    const races = props.races

    if(props.timezone){
        timezone = props.timezone;
    }

    // TODO Improve this isNextRace logic
    let isNextRace = false
    let nextRace = null

    return (
        <div className={styles.races}>
            <table id="events-table">
                <thead>
                <tr className={styles.tableHead}>
                    <th scope="col" className={styles.icon_column}></th>
                    <th scope="col" className={styles.event_column}>{t('calendar:event')} {props.year}</th>
                    <th scope="col" className={styles.date_column}>{t('calendar:date')}</th>
                    <th scope="col" className={styles.time_column}>{t('calendar:time')}</th>
                </tr>
                </thead>

                {races.map((item, index) => {
                    isNextRace = false
                    if (item.sessions && moment(item.sessions.race).isAfter() && !nextRace && !item.canceled && !item.tbc) {
                        isNextRace = true
                        nextRace = item
                    }
                    return (
                        <Race item={item} index={index} timezone={timezone} key={item.slug} isNextRace={isNextRace}/>)
                })}
            </table>
        </div>
    );
};

export default Races;