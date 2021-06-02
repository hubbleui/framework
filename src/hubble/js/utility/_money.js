/**
 * Money Formatter
 *
 * @see https://github.com/gerardojbaez/money
 * @example Money.format(12.99, 'USD'); // RESULT: $12.99
 * 
 */
(function()
{
    /**
     * number_format
     *
     * @see https://github.com/locutusjs/locutus/blob/e0a68222d482d43164e96ab96023b712d25680a6/src/php/strings/number_format.js
     */
    function number_format(number, decimals, decPoint, thousandsSep)
    { // eslint-disable-line camelcase
        //  discuss at: https://locutus.io/php/number_format/
        // original by: Jonas Raoni Soares Silva (https://www.jsfromhell.com)
        // improved by: Kevin van Zonneveld (https://kvz.io)
        // improved by: davook
        // improved by: Brett Zamir (https://brett-zamir.me)
        // improved by: Brett Zamir (https://brett-zamir.me)
        // improved by: Theriault (https://github.com/Theriault)
        // improved by: Kevin van Zonneveld (https://kvz.io)
        // bugfixed by: Michael White (https://getsprink.com)
        // bugfixed by: Benjamin Lupton
        // bugfixed by: Allan Jensen (https://www.winternet.no)
        // bugfixed by: Howard Yeend
        // bugfixed by: Diogo Resende
        // bugfixed by: Rival
        // bugfixed by: Brett Zamir (https://brett-zamir.me)
        //  revised by: Jonas Raoni Soares Silva (https://www.jsfromhell.com)
        //  revised by: Luke Smith (https://lucassmith.name)
        //    input by: Kheang Hok Chin (https://www.distantia.ca/)
        //    input by: Jay Klehr
        //    input by: Amir Habibi (https://www.residence-mixte.com/)
        //    input by: Amirouche
        //   example 1: number_format(1234.56)
        //   returns 1: '1,235'
        //   example 2: number_format(1234.56, 2, ',', ' ')
        //   returns 2: '1 234,56'
        //   example 3: number_format(1234.5678, 2, '.', '')
        //   returns 3: '1234.57'
        //   example 4: number_format(67, 2, ',', '.')
        //   returns 4: '67,00'
        //   example 5: number_format(1000)
        //   returns 5: '1,000'
        //   example 6: number_format(67.311, 2)
        //   returns 6: '67.31'
        //   example 7: number_format(1000.55, 1)
        //   returns 7: '1,000.6'
        //   example 8: number_format(67000, 5, ',', '.')
        //   returns 8: '67.000,00000'
        //   example 9: number_format(0.9, 0)
        //   returns 9: '1'
        //  example 10: number_format('1.20', 2)
        //  returns 10: '1.20'
        //  example 11: number_format('1.20', 4)
        //  returns 11: '1.2000'
        //  example 12: number_format('1.2000', 3)
        //  returns 12: '1.200'
        //  example 13: number_format('1 000,50', 2, '.', ' ')
        //  returns 13: '100 050.00'
        //  example 14: number_format(1e-8, 8, '.', '')
        //  returns 14: '0.00000001'

        number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
        const n = !isFinite(+number) ? 0 : +number
        const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
        const sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
        const dec = (typeof decPoint === 'undefined') ? '.' : decPoint
        let s = '';

        const toFixedFix = function(n, prec)
        {
            if (('' + n).indexOf('e') === -1)
            {
                return +(Math.round(n + 'e+' + prec) + 'e-' + prec)
            }
            else
            {
                const arr = ('' + n).split('e')
                let sig = ''
                if (+arr[1] + prec > 0)
                {
                    sig = '+'
                }
                return (+(Math.round(+arr[0] + 'e' + sig + (+arr[1] + prec)) + 'e-' + prec)).toFixed(prec)
            }
        }

        // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.')
        if (s[0].length > 3)
        {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
        }
        if ((s[1] || '').length < prec)
        {
            s[1] = s[1] || ''
            s[1] += new Array(prec - s[1].length + 1).join('0')
        }

        return s.join(dec)
    }


    /**
     * Currency Formats.
     *
     * Formats initially collected from
     * http://www.joelpeterson.com/blog/2011/03/formatting-over-100-currencies-in-php/
     *
     * All currencies were validated against some trusted
     * sources like Wikipedia, thefinancials.com and
     * cldr.unicode.org.
     *
     * Please note that each format used on each currency is
     * the format for that particular country/language.
     * When the country is unknown, the English format is used.
     *
     * @todo REFACTOR! This should be located on a separated file. Working on that!
     *
     * @var array
     */
    var currencies = {
        'NGN':
        {
            'code': 'NGN',
            'title': 'Nigerian Naira',
            'symbol': '₦',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'ARS':
        {
            'code': 'ARS',
            'title': 'Argentine Peso',
            'symbol': 'AR$',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'AMD':
        {
            'code': 'AMD',
            'title': 'Armenian Dram',
            'symbol': 'Դ',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'AWG':
        {
            'code': 'AWG',
            'title': 'Aruban Guilder',
            'symbol': 'Afl. ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'AUD':
        {
            'code': 'AUD',
            'title': 'Australian Dollar',
            'symbol': '$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BSD':
        {
            'code': 'BSD',
            'title': 'Bahamian Dollar',
            'symbol': 'B$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BHD':
        {
            'code': 'BHD',
            'title': 'Bahraini Dinar',
            'symbol': null,
            'precision': 3,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BDT':
        {
            'code': 'BDT',
            'title': 'Bangladesh, Taka',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BZD':
        {
            'code': 'BZD',
            'title': 'Belize Dollar',
            'symbol': 'BZ$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BMD':
        {
            'code': 'BMD',
            'title': 'Bermudian Dollar',
            'symbol': 'BD$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BOB':
        {
            'code': 'BOB',
            'title': 'Bolivia, Boliviano',
            'symbol': 'Bs',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'BAM':
        {
            'code': 'BAM',
            'title': 'Bosnia and Herzegovina convertible mark',
            'symbol': 'KM ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'BWP':
        {
            'code': 'BWP',
            'title': 'Botswana, Pula',
            'symbol': 'p',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'BRL':
        {
            'code': 'BRL',
            'title': 'Brazilian Real',
            'symbol': 'R$',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'BND':
        {
            'code': 'BND',
            'title': 'Brunei Dollar',
            'symbol': 'B$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'CAD':
        {
            'code': 'CAD',
            'title': 'Canadian Dollar',
            'symbol': 'CA$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KYD':
        {
            'code': 'KYD',
            'title': 'Cayman Islands Dollar',
            'symbol': 'CI$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'CLP':
        {
            'code': 'CLP',
            'title': 'Chilean Peso',
            'symbol': 'CLP$',
            'precision': 0,
            'thousandSeparator': '.',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'CNY':
        {
            'code': 'CNY',
            'title': 'China Yuan Renminbi',
            'symbol': 'CN¥',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'COP':
        {
            'code': 'COP',
            'title': 'Colombian Peso',
            'symbol': 'COL$',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'CRC':
        {
            'code': 'CRC',
            'title': 'Costa Rican Colon',
            'symbol': '₡',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'HRK':
        {
            'code': 'HRK',
            'title': 'Croatian Kuna',
            'symbol': ' kn',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'CUC':
        {
            'code': 'CUC',
            'title': 'Cuban Convertible Peso',
            'symbol': 'CUC$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'CUP':
        {
            'code': 'CUP',
            'title': 'Cuban Peso',
            'symbol': 'CUP$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'CYP':
        {
            'code': 'CYP',
            'title': 'Cyprus Pound',
            'symbol': '£',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'CZK':
        {
            'code': 'CZK',
            'title': 'Czech Koruna',
            'symbol': ' Kč',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'DKK':
        {
            'code': 'DKK',
            'title': 'Danish Krone',
            'symbol': ' kr.',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'DOP':
        {
            'code': 'DOP',
            'title': 'Dominican Peso',
            'symbol': 'RD$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'XCD':
        {
            'code': 'XCD',
            'title': 'East Caribbean Dollar',
            'symbol': 'EC$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'EGP':
        {
            'code': 'EGP',
            'title': 'Egyptian Pound',
            'symbol': 'EGP',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'SVC':
        {
            'code': 'SVC',
            'title': 'El Salvador Colon',
            'symbol': '₡',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'EUR':
        {
            'code': 'EUR',
            'title': 'Euro',
            'symbol': '€',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'GHC':
        {
            'code': 'GHC',
            'title': 'Ghana, Cedi',
            'symbol': 'GH₵',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'GIP':
        {
            'code': 'GIP',
            'title': 'Gibraltar Pound',
            'symbol': '£',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'GTQ':
        {
            'code': 'GTQ',
            'title': 'Guatemala, Quetzal',
            'symbol': 'Q',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'HNL':
        {
            'code': 'HNL',
            'title': 'Honduras, Lempira',
            'symbol': 'L',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'HKD':
        {
            'code': 'HKD',
            'title': 'Hong Kong Dollar',
            'symbol': 'HK$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'HUF':
        {
            'code': 'HUF',
            'title': 'Hungary, Forint',
            'symbol': ' Ft',
            'precision': 0,
            'thousandSeparator': ' ',
            'decimalSeparator': '',
            'symbolPlacement': 'after'
        },
        'ISK':
        {
            'code': 'ISK',
            'title': 'Iceland Krona',
            'symbol': ' kr',
            'precision': 0,
            'thousandSeparator': '.',
            'decimalSeparator': '',
            'symbolPlacement': 'after'
        },
        'INR':
        {
            'code': 'INR',
            'title': 'Indian Rupee ₹',
            'symbol': '₹',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'IDR':
        {
            'code': 'IDR',
            'title': 'Indonesia, Rupiah',
            'symbol': 'Rp',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'IRR':
        {
            'code': 'IRR',
            'title': 'Iranian Rial',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'JMD':
        {
            'code': 'JMD',
            'title': 'Jamaican Dollar',
            'symbol': 'J$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'JPY':
        {
            'code': 'JPY',
            'title': 'Japan, Yen',
            'symbol': '¥',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'JOD':
        {
            'code': 'JOD',
            'title': 'Jordanian Dinar',
            'symbol': null,
            'precision': 3,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KES':
        {
            'code': 'KES',
            'title': 'Kenyan Shilling',
            'symbol': 'KSh',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KWD':
        {
            'code': 'KWD',
            'title': 'Kuwaiti Dinar',
            'symbol': 'K.D.',
            'precision': 3,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KZT':
        {
            'code': 'KZT',
            'title': 'Kazakh tenge',
            'symbol': '₸',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'LVL':
        {
            'code': 'LVL',
            'title': 'Latvian Lats',
            'symbol': 'Ls',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'LBP':
        {
            'code': 'LBP',
            'title': 'Lebanese Pound',
            'symbol': 'LBP',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'LTL':
        {
            'code': 'LTL',
            'title': 'Lithuanian Litas',
            'symbol': ' Lt',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'MKD':
        {
            'code': 'MKD',
            'title': 'Macedonia, Denar',
            'symbol': 'ден ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'MYR':
        {
            'code': 'MYR',
            'title': 'Malaysian Ringgit',
            'symbol': 'RM',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'MTL':
        {
            'code': 'MTL',
            'title': 'Maltese Lira',
            'symbol': 'Lm',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'MUR':
        {
            'code': 'MUR',
            'title': 'Mauritius Rupee',
            'symbol': 'Rs',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'MXN':
        {
            'code': 'MXN',
            'title': 'Mexican Peso',
            'symbol': 'MX$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'MZM':
        {
            'code': 'MZM',
            'title': 'Mozambique Metical',
            'symbol': 'MT',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'NPR':
        {
            'code': 'NPR',
            'title': 'Nepalese Rupee',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'ANG':
        {
            'code': 'ANG',
            'title': 'Netherlands Antillian Guilder',
            'symbol': 'NAƒ ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'ILS':
        {
            'code': 'ILS',
            'title': 'New Israeli Shekel ₪',
            'symbol': ' ₪',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'after'
        },
        'TRY':
        {
            'code': 'TRY',
            'title': 'New Turkish Lira',
            'symbol': '₺',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'NZD':
        {
            'code': 'NZD',
            'title': 'New Zealand Dollar',
            'symbol': 'NZ$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'NOK':
        {
            'code': 'NOK',
            'title': 'Norwegian Krone',
            'symbol': 'kr ',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'PKR':
        {
            'code': 'PKR',
            'title': 'Pakistan Rupee',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'PEN':
        {
            'code': 'PEN',
            'title': 'Peru, Nuevo Sol',
            'symbol': 'S/.',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'UYU':
        {
            'code': 'UYU',
            'title': 'Peso Uruguayo',
            'symbol': '$U ',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'PHP':
        {
            'code': 'PHP',
            'title': 'Philippine Peso',
            'symbol': '₱',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'PLN':
        {
            'code': 'PLN',
            'title': 'Poland, Zloty',
            'symbol': ' zł',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'GBP':
        {
            'code': 'GBP',
            'title': 'Pound Sterling',
            'symbol': '£',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'OMR':
        {
            'code': 'OMR',
            'title': 'Rial Omani',
            'symbol': 'OMR',
            'precision': 3,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'RON':
        {
            'code': 'RON',
            'title': 'Romania, New Leu',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'ROL':
        {
            'code': 'ROL',
            'title': 'Romania, Old Leu',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'RUB':
        {
            'code': 'RUB',
            'title': 'Russian Ruble',
            'symbol': ' ₽',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'SAR':
        {
            'code': 'SAR',
            'title': 'Saudi Riyal',
            'symbol': 'SAR',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'SGD':
        {
            'code': 'SGD',
            'title': 'Singapore Dollar',
            'symbol': 'S$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'SKK':
        {
            'code': 'SKK',
            'title': 'Slovak Koruna',
            'symbol': ' SKK',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'SIT':
        {
            'code': 'SIT',
            'title': 'Slovenia, Tolar',
            'symbol': null,
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'ZAR':
        {
            'code': 'ZAR',
            'title': 'South Africa, Rand',
            'symbol': 'R',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'KRW':
        {
            'code': 'KRW',
            'title': 'South Korea, Won ₩',
            'symbol': '₩',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'SZL':
        {
            'code': 'SZL',
            'title': 'Swaziland, Lilangeni',
            'symbol': 'E',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'SEK':
        {
            'code': 'SEK',
            'title': 'Swedish Krona',
            'symbol': ' kr',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'CHF':
        {
            'code': 'CHF',
            'title': 'Swiss Franc',
            'symbol': 'SFr ',
            'precision': 2,
            'thousandSeparator': '\'',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'TZS':
        {
            'code': 'TZS',
            'title': 'Tanzanian Shilling',
            'symbol': 'TSh',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'THB':
        {
            'code': 'THB',
            'title': 'Thailand, Baht ฿',
            'symbol': '฿',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'TOP':
        {
            'code': 'TOP',
            'title': 'Tonga, Paanga',
            'symbol': 'T$ ',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'AED':
        {
            'code': 'AED',
            'title': 'UAE Dirham',
            'symbol': 'AED',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'UAH':
        {
            'code': 'UAH',
            'title': 'Ukraine, Hryvnia',
            'symbol': ' ₴',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': ',',
            'symbolPlacement': 'after'
        },
        'USD':
        {
            'code': 'USD',
            'title': 'US Dollar',
            'symbol': '$',
            'precision': 2,
            'thousandSeparator': ',',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
        'VUV':
        {
            'code': 'VUV',
            'title': 'Vanuatu, Vatu',
            'symbol': 'VT',
            'precision': 0,
            'thousandSeparator': ',',
            'decimalSeparator': '',
            'symbolPlacement': 'before'
        },
        'VEF':
        {
            'code': 'VEF',
            'title': 'Venezuela Bolivares Fuertes',
            'symbol': 'Bs.',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'VEB':
        {
            'code': 'VEB',
            'title': 'Venezuela, Bolivar',
            'symbol': 'Bs.',
            'precision': 2,
            'thousandSeparator': '.',
            'decimalSeparator': ',',
            'symbolPlacement': 'before'
        },
        'VND':
        {
            'code': 'VND',
            'title': 'Viet Nam, Dong ₫',
            'symbol': ' ₫',
            'precision': 0,
            'thousandSeparator': '.',
            'decimalSeparator': '',
            'symbolPlacement': 'after'
        },
        'ZWD':
        {
            'code': 'ZWD',
            'title': 'Zimbabwe Dollar',
            'symbol': 'Z$',
            'precision': 2,
            'thousandSeparator': ' ',
            'decimalSeparator': '.',
            'symbolPlacement': 'before'
        },
    };

    /**
     * Create new Currency instance.
     *
     * @param  string Currency ISO-4217 code
     * @return void
     */
    var Currency = function(code)
    {
        /**
         * ISO-4217 Currency Code.
         *
         * @var string
         */
        this.code = null;

        /**
         * Currency symbol.
         *
         * @var string
         */
        this.symbol = null;

        /**
         * Currency precision (number of decimals).
         *
         * @var int
         */
        this.precision = null;

        /**
         * Currency title.
         *
         * @var string
         */
        this.title = null;

        /**
         * Currency thousand separator.
         *
         * @var string
         */
        this.thousandSeparator = null;

        /**
         * Currency decimal separator.
         *
         * @var string
         */
        this.decimalSeparator = null;

        /**
         * Currency symbol placement.
         *
         * @var string (front|after) currency
         */
        this.symbolPlacement = null;

        if (!this.hasCurrency(code))
        {
            throw new Error('Currency not found: "' + code + '"');
        }

        var currency = this.getCurrency(code);

        for (var key in currency)
        {
            if (!currency.hasOwnProperty(key))
            {
                continue;
            }

            this[key] = currency[key];
        }

        return this;
    }

    /**
     * Get currency ISO-4217 code.
     *
     * @return string
     */
    Currency.prototype.getCode = function()
    {
        return this.code;
    }

    /**
     * Get currency symbol.
     *
     * @return string
     */
    Currency.prototype.getSymbol = function()
    {
        return this.symbol;
    }

    /**
     * Get currency precision.
     *
     * @return int
     */
    Currency.prototype.getPrecision = function()
    {
        return this.precision;
    }

    /**
     * @param integer precision
     * @return this
     */
    Currency.prototype.setPrecision = function(precision)
    {
        this.precision = precision;

        return this;
    }

    /**
     * Get currency title.
     *
     * @return string
     */
    Currency.prototype.getTitle = function()
    {
        return this.title;
    }

    /**
     * Get currency thousand separator.
     *
     * @return string
     */
    Currency.prototype.getThousandSeparator = function()
    {
        return this.thousandSeparator;
    }

    /**
     * @param string separator
     * @return this
     */
    Currency.prototype.setThousandSeparator = function(separator)
    {
        this.thousandSeparator = separator;

        return this;
    }

    /**
     * Get currency decimal separator.
     *
     * @return string
     */
    Currency.prototype.getDecimalSeparator = function()
    {
        return this.decimalSeparator;
    }

    /**
     * @param string separator
     * @return this
     */
    Currency.prototype.setDecimalSeparator = function(separator)
    {
        this.decimalSeparator = separator;

        return this;
    }

    /**
     * Get currency symbol placement.
     *
     * @return string
     */
    Currency.prototype.getSymbolPlacement = function()
    {
        return this.symbolPlacement;
    }

    /**
     * @param string placement [before|after]
     * @return this
     */
    Currency.prototype.setSymbolPlacement = function(placement)
    {
        this.symbolPlacement = placement;

        return this;
    }

    /**
     * Get all currencies.
     *
     * @return object
     */
    Currency.prototype.getAllCurrencies = function()
    {
        return currencies;
    }

    /**
     * Set currency
     * 
     * @return void
     */
    Currency.prototype.setCurrency = function(code, currency)
    {
        currencies[code] = currency;
    }

    /**
     * Get currency.
     *
     * @access protected
     * @return object
     */
    Currency.prototype.getCurrency = function(code)
    {
        return currencies[code];
    }

    /**
     * Check currency existence (within the class)
     *
     * @access protected
     * @return bool
     */
    Currency.prototype.hasCurrency = function(code)
    {
        return code in currencies
    }

    /**
     * Create new Money Instance
     *
     * @param float|int
     * @param mixed $currency
     * @return void
     */
    var Money = function(amount, currency)
    {
        this._amount = parseFloat(amount);

        currency = (typeof currency === 'undefined' ? 'AUD' : currency);

        if (typeof currency === 'string')
        {
            this._currency = new Currency(currency);
        }
        else if (currency instanceof Currency)
        {
            this._currency = currency;
        }

        return this;
    }

    /**
     * Converts from cents to dollars
     *
     * @return string
     */
    Money.prototype.fromCents = function()
    {
        this._amount = this._amount / 100;

        return this;
    }

    /**
     * Format amount to currency equivalent string.
     *
     * @return string
     */
    Money.prototype.format = function()
    {
        var format = this.amount();

        if (this._currency.getSymbol() === null)
        {
            format += ' ' + this._currency.getCode();
        }
        else if (this._currency.getSymbolPlacement() == 'before')
        {
            format = this._currency.getSymbol() + format;
        }
        else
        {
            format += this._currency.getSymbol();
        }

        return format;
    }

    /**
     * Get amount formatted to currency.
     *
     * @return mixed
     */
    Money.prototype.amount = function()
    {
        // Indian Rupee use special format
        if (this._currency.getCode() == 'INR')
        {
            return this._amount.toString().split('.')[0].length > 3 ? this._amount.toString().substring(0, this._amount.toString().split('.')[0].length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + this._amount.toString().substring(this._amount.toString().split('.')[0].length - 3) : this._amount.toString();
        }

        // Return western format
        return number_format(
            this._amount,
            this._currency.getPrecision(),
            this._currency.getDecimalSeparator(),
            this._currency.getThousandSeparator()
        );
    }

    /**
     * Get amount formatted decimal.
     *
     * @return string decimal
     */
    Money.prototype.toDecimal = function()
    {
        return this._amount.toString();
    }

    /**
     * parses locale formatted money string
     * to object of class Money
     *
     * @param  string          $str      Locale Formatted Money String
     * @param  Currency|string $currency default 'AUD'
     * @return Money           $money    Decimal String
     */
    Money.prototype.parse = function(str, currency)
    {
        currency = typeof currency === 'undefined' ? 'AUD' : currency;

        // get currency object
        currency = typeof currency === 'string' ? new Currency(currency) : currency;

        // remove HTML encoded characters: http://stackoverflow.com/a/657670
        // special characters that arrive like &0234;
        // remove all leading non numbers
        str = str.replace(/&#?[a-z0-9]{2,8};/ig, '').replace(/^[^0-9]*/g, '');

        // remove all thousands separators
        if (currency.getThousandSeparator().length > 0)
        {
            str = str.replaceAll(currency.getThousandSeparator(), '');
        }

        if (currency.getDecimalSeparator().length > 0)
        {
            // make decimal separator regex safe
            var char = currency.getDecimalSeparator();

            // remove all other characters
            // convert all decimal seperators to PHP/bcmath safe decimal '.'

            str = str.replace(new RegExp('[^\\' + char + '\\d]+', 'g'), '').replaceAll(char, '.');
        }
        else
        {
            // for currencies that do not have decimal points
            // remove all other characters
            str = str.replace(/[^\d]/, '');
        }

        return new Money(str, currency);
    }

    // Load into container 
    Container.set('Money', Money);

    Container.set('Currency', Currency);

}());