import UserContext from '../../components/UserContext'
const moment = require('moment-timezone')
import withTranslation from 'next-translate/withTranslation'
import {Bar} from './style'

class OptionsBar extends React.Component {
    static contextType = UserContext

    constructor(props) {
        super(props)

        this.state = {
            pickerShowing: true
        }
    }

    componentDidMount() {
        this.setState({
            pickerShowing: false
        })
    }

    onChange = event => {
        this.context.setTimezone(event.target.value);
    }

    togglePicker = event => {
        event.preventDefault()

        this.setState({
            pickerShowing: !this.state.pickerShowing
        })
    }

    render() {
        const {t, lang} = this.props.i18n

        // Picker Items
        const timezoneItems = []

        const scrubbedPrefixes = ['Antarctica', 'Arctic', 'Canada', 'Chile', 'Etc', 'Mexico', 'US'];
        const scrubbedSuffixes = ['ACT', 'East', 'Knox_IN', 'LHI', 'North', 'NSW', 'South', 'West'];

        const tzNames = moment.tz.names()
            .filter(name => name.indexOf('/') !== -1)
            .filter(name => !scrubbedPrefixes.includes(name.split('/')[0]))
            .filter(name => !scrubbedSuffixes.includes(name.split('/').slice(-1)[0]));

        tzNames.reduce((memo, tz) => {
            memo.push({
                name: tz,
                offset: moment.tz(tz).utcOffset()
            });

            return memo;
        }, [])
            .sort((a, b) => {
                return a.offset - b.offset
            })
            .reduce((memo, tz) => {
                const timezone = tz.offset ? moment.tz(tz.name).format('Z') : '';

                timezoneItems.push(<option value={tz.name}
                                           key={tz.name}>(GMT{timezone}) {tz.name.replace("_", " ")}</option>);
            }, "");

        return (
                <Bar>
                    {this.state.pickerShowing ?
                        <>
                            <form action="/" method="GET" id="timezone-picker">
                                <label htmlFor="timezone"
                                       className="pickerLabel">{t('common:options.timezonePicker.pick')}</label>
                                <select id="timezone" onChange={this.onChange} name="timezone"
                                        value={this.context.timezone}>
                                    {timezoneItems}
                                </select>

                                <button onClick={this.togglePicker}
                                        type="submit">{t('common:options.timezonePicker.button')}</button>
                                <noscript>
                                    <style>{`#timezone-picker { display:none; } `}</style>
                                </noscript>
                            </form>
                            <noscript>
                                <a href="/timezones">{t('common:options.timezonePicker.pick')}</a>
                            </noscript>
                        </>
                        :
                        <>
                            <a onClick={this.togglePicker}>
                                {t('common:options.timezonePicker.showing')} <strong>{this.context.timezone && this.context.timezone.replace("_", " ")}</strong>.
                            </a>
                        </>
                    }
                </Bar>
        );
    }
}

export default withTranslation(OptionsBar)
