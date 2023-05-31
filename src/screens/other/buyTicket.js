/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { IMAGE, color, fontFamily, fontSize } from '../../constant/';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
// import {Divider, Input,Overlay} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import BraintreeDropIn from 'react-native-braintree-dropin-ui';
import Loader from './../../component/loader';
import CountDown from 'react-native-countdown-fixed';
import { APIRequest, APIRequestWithFile, ApiUrl } from './../../utils/api';
import moment from 'moment';
import { User } from '../../utils/user';
import Toast from 'react-native-toast-message';
import WebView from 'react-native-webview';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GenrateAttendee from './genrateAttendee';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../component/'
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export default class buyTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymenturl: null,
      successmoda: false,
      user_id: '',
      promocode: [],
      promoapplied: [],
      discount: [],
      name: '',
      mobile: '',
      address: '',
      individualTickerPrice: [],
      visible: false,
      ticket: '1',
      evnetId: this.props.route.params.event_id,
      ticketDetail: {},
      max_ticket_qty: 0,
      tickets_data: {},
      ticketList: [],
      attendees: [],
      currency: '',
      payment_method: '',
      from_date: this.props?.route?.params.date?.start_date,
      to_date: this.props?.route?.params?.date?.end_date,
      from_time: this.props?.route?.params.date?.start_time,
      to_time: this.props?.route?.params.date?.end_time,
      isloading: true,
      totalQty: 0,
      grandTotal: 0,
      totalPrice: 0,
      taxAmount: 0,
      promocodeDiscount: 0,
      netTotal: 0,
      currentSelectedSeat: null,
      token:
        'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjMkZ1WkdKdmVDSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VZbkpoYVc1MGNtVmxaMkYwWlhkaGVTNWpiMjBpZlEuZXlKbGVIQWlPakUyTmpBNE16RTNOVEFzSW1wMGFTSTZJakJrWWpVMk9URmxMV1ptTm1NdE5EazRZUzA1WkdJd0xXTmpPVFZtWWpWbVkyVXpOaUlzSW5OMVlpSTZJblF5T1hadWNXWndNM1JrYURkeU5EUWlMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzV6WVc1a1ltOTRMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SWl3aWJXVnlZMmhoYm5RaU9uc2ljSFZpYkdsalgybGtJam9pZERJNWRtNXhabkF6ZEdSb04zSTBOQ0lzSW5abGNtbG1lVjlqWVhKa1gySjVYMlJsWm1GMWJIUWlPbVpoYkhObGZTd2ljbWxuYUhSeklqcGJJbTFoYm1GblpWOTJZWFZzZENKZExDSnpZMjl3WlNJNld5SkNjbUZwYm5SeVpXVTZWbUYxYkhRaVhTd2liM0IwYVc5dWN5STZlMzE5LkFzM1UwUlF4WmtYTm42U190RnBjMVc2dnh5OFl3aTNsblRjVW5fTVg5VzNqYnZ3bFpKOFZvMlF1MjQ2MGpLeW1OTFAwbTRsTnlfZlg3Q091ZE40WllnIiwiY29uZmlnVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL3QyOXZucWZwM3RkaDdyNDQvY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwiZ3JhcGhRTCI6eyJ1cmwiOiJodHRwczovL3BheW1lbnRzLnNhbmRib3guYnJhaW50cmVlLWFwaS5jb20vZ3JhcGhxbCIsImRhdGUiOiIyMDE4LTA1LTA4IiwiZmVhdHVyZXMiOlsidG9rZW5pemVfY3JlZGl0X2NhcmRzIl19LCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvdDI5dm5xZnAzdGRoN3I0NC9jbGllbnRfYXBpIiwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwibWVyY2hhbnRJZCI6InQyOXZucWZwM3RkaDdyNDQiLCJhc3NldHNVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImF1dGhVcmwiOiJodHRwczovL2F1dGgudmVubW8uc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbSIsInZlbm1vIjoib2ZmIiwiY2hhbGxlbmdlcyI6W10sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsImFuYWx5dGljcyI6eyJ1cmwiOiJodHRwczovL29yaWdpbi1hbmFseXRpY3Mtc2FuZC5zYW5kYm94LmJyYWludHJlZS1hcGkuY29tL3QyOXZucWZwM3RkaDdyNDQifSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImJpbGxpbmdBZ3JlZW1lbnRzRW5hYmxlZCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJhbGxvd0h0dHAiOnRydWUsImRpc3BsYXlOYW1lIjoiU2hyaUdlbmVzaXMiLCJjbGllbnRJZCI6bnVsbCwicHJpdmFjeVVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbS9wcCIsInVzZXJBZ3JlZW1lbnRVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vdG9zIiwiYmFzZVVybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9jaGVja291dC5wYXlwYWwuY29tIiwiZGlyZWN0QmFzZVVybCI6bnVsbCwiZW52aXJvbm1lbnQiOiJvZmZsaW5lIiwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwibWVyY2hhbnRBY2NvdW50SWQiOiJzaHJpZ2VuZXNpcyIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9fQ==',
    };
  }

  componentDidMount = () => {
    this.getTickets();
    let userdata = new User().getuserdata();

    this.setState({ user_id: userdata?.id });
  };

  getTickets = () => {
    let config = {
      url: ApiUrl.checkoutInfo,
      method: 'post',
      body: {
        event_id: this.state.evnetId,
        startDate: this.state.from_date,
        endDate: this.state.to_date,
        startTime: this.state.from_time,
        endTime: this.state.to_time,
        // event_id: 9,
      },
    };
    APIRequest(
      config,

      res => {
        if (res.status) {
          var quantity = [];
          var promocode = [];
          var promoapplied = [];
          for (let i = 0; i < res?.tickets_data?.tickets?.length; i++) {
            quantity.push('0');
            promocode.push(null);
            promoapplied.push(null);
          }

          this.setState({
            ticketDetail: res.event,
            max_ticket_qty: res.max_ticket_qty,
            tickets_data: res.tickets_data,
            quantity: quantity,
            promocode: promocode,
            currency: res.currency,
            isloading: false
          });
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  handelunselect = async (seat, i, item) => {
    try {
      const { ticketList } = this.state;
      const checkId = item.id;
    } catch (error) {
      console.log(error.message);
    }
  };

  handleSelectValue = async (value, item, seat, updateAttendee) => {
    try {
      var { ticketList } = this.state;

      const ticketId = item.id;
      if (seat == '') {
        var elementPos = ticketList.map(x => x.ticketId).indexOf(ticketId);
        if (elementPos !== -1) {
          ticketList.splice(elementPos, 1);
          ticketList.push({ ticketId, value, item });
        } else {
          ticketList.push({ ticketId, value, item });
        }
      } else {
        const seatId = seat.id;
        const isAnyTicketSelected = ticketList.find(
          t => t.ticketId == ticketId,
        );
        if (isAnyTicketSelected === undefined) {
          const seat_ids = [seatId];
          ticketList.push({ ticketId, value, item, seat_ids });
        } else {
          if (isAnyTicketSelected?.seat_ids?.includes(seatId)) {
            const removedSeats = isAnyTicketSelected?.seat_ids.filter(
              s => s != seatId,
            );
            const new_quntity =
              parseInt(isAnyTicketSelected?.value) - parseInt(value);
            let newTikcetList = {
              ...isAnyTicketSelected,
              value: new_quntity,
              seat_ids: removedSeats,
            };
            ticketList = ticketList.map(t =>
              t.ticketId == ticketId ? newTikcetList : t,
            );
          } else {
            const addedSeats = isAnyTicketSelected?.seat_ids;
            if (addedSeats.length < this.state.max_ticket_qty) {
              addedSeats.push(seatId);
              let new_quntity =
                parseInt(isAnyTicketSelected?.value) + parseInt(value);
              let newTikcetList = {
                ...isAnyTicketSelected,
                value: new_quntity,
              };
              ticketList = ticketList.map(t =>
                t.ticketId == ticketId ? newTikcetList : t,
              );
            } else {
              Toast.show({
                type: 'info',
                text1: 'Max limit for one person to book ticket is over'
              })
              return false;
            }
          }
        }
      }

      var total_price = 0;
      var grand_total = 0;
      var totalTax = 0;
      var totalPromoDiscount = 0;
      var netAmount = 0;

      for (let index = 0; index < ticketList.length; index++) {
        let ticket = ticketList[index].item;
        let baseQuantity = ticketList[index].value;
        let { tax, price } = this.calculateTicketPriceWithTax(
          ticket,
          baseQuantity,
        );
        const ticktPriceTotal = tax + price;
        const promocode_discount = this.calculatePromocodeDiscounts(
          ticktPriceTotal,
          ticket,
        );
        totalTax = totalTax + tax;
        total_price = total_price + price;
        totalPromoDiscount = totalPromoDiscount + promocode_discount;
      }

      grand_total = total_price + totalTax;
      netAmount = grand_total - totalPromoDiscount;
      const totalQty = ticketList.reduce(
        (pre, curr) => pre + parseInt(curr.value),
        0,
      );

      this.setState({
        ...this.state,
        totalQty: totalQty,
        ticketList: ticketList,
        grandTotal: parseFloat(grand_total).toFixed(2),
        totalPrice: parseFloat(total_price).toFixed(2),
        taxAmount: parseFloat(totalTax).toFixed(2),
        promocodeDiscount: parseFloat(totalPromoDiscount).toFixed(2),
        netTotal: parseFloat(netAmount).toFixed(2),
        currentSelectedSeat: seat != '' ? seat?.id : null,
      });
      if (updateAttendee === 'YES') {
        this.addAttendee(item, seat, value);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  calculatePromocodeDiscounts = (ticketPrice, ticket) => {
    let promocode_discount = 0.0;
    if (ticket.promocode !== undefined) {
      if (ticket.promocode?.p_type === 'percent') {
        promocode_discount =
          promocode_discount +
          (parseFloat(ticket.promocode?.reward) / 100) * ticketPrice;
      } else {
        promocode_discount =
          promocode_discount + parseFloat(ticket.promocode?.reward);
      }
    }
    return promocode_discount;
  };

  calculateTicketPriceWithTax(ticket, quntity) {
    let basePrice = ticket?.sale_start_date
      ? this.checkSaleIslive(ticket)
        ? ticket?.sale_price
        : ticket.price
      : ticket.price
        ? ticket.price
        : 0.0;
    let baseQuantity = quntity;
    let price = parseFloat(basePrice) * parseFloat(baseQuantity);
    const taxesforOneticket = ticket.taxes
      .filter(t => t.net_price == 'excluding')
      .reduce(
        (pre, curr) =>
          curr.rate_type == 'percent'
            ? pre + parseFloat((curr.rate / 100) * basePrice)
            : pre + parseFloat(curr.rate),
        0,
      );

    const tax = taxesforOneticket * baseQuantity;
    return { price, tax };
  }

  calculatetotal = () => {
    var quan = this.state.quantity;

    var total = 0;
    for (let i = 0; i < this.state.tickets_data?.tickets?.length; i++) {
      if (this.state.promoapplied[i] != null) {
        var type = this.state.promoapplied[i]?.p_type;
        var reward = this.state.promoapplied[i].reward;
        if (type == 'percent') {
          var itemtoal =
            parseInt(quan[i]) *
            parseFloat(this.state.tickets_data?.tickets[i].price);
          var percent = (reward / 100) * itemtoal;
          total += itemtoal - percent;
        } else {
          var itemtoal =
            parseInt(quan[i]) *
            parseFloat(this.state.tickets_data?.tickets[i].price);

          total += itemtoal - reward;
        }
      } else {
        total +=
          parseInt(quan[i]) *
          parseFloat(this.state.tickets_data?.tickets[i].price);
      }
    }

    return total;
  };

  bookticket = type => {
    this.setState({ isloading: true });

    var t_id = [];
    var ticket_title = [];
    var qunatity = [];
    for (let i = 0; i < this.state.tickets_data?.tickets?.length; i++) {
      t_id.push(this.state.tickets_data?.tickets[i].id);
      ticket_title.push(this.state.tickets_data?.tickets[i].title);
      if (this.state.ticketList.length > 0) {
        const isTicket = this.state.ticketList.find(
          t => t.ticketId == this.state.tickets_data?.tickets[i].id,
        );
        if (isTicket !== undefined) {
          qunatity.push(isTicket.value);
        } else {
          qunatity.push(0);
        }
      } else {
        qunatity.push(0);
      }
    }
    let promocodes = this.state.ticketList.filter(
      t => t.item.promocode !== undefined,
    )
      ? this.state.ticketList
        .filter(t => t.item.promocode !== undefined)
        .map(pc => ({
          ticket_id: pc.ticketId,
          code: pc.item.promocode.code,
        }))
      : [];

    var data = {
      event_id: this.state.ticketDetail?.id,
      booking_date: this.state.from_date,
      booking_end_date: this.state.to_date,
      start_time: this.state.from_time,
      end_time: this.state.to_time,
      merge_schedule: this.state.ticketDetail?.merge_schedule,
      quantity: qunatity,
      customer_id: '0',
      ticket_id: t_id,
      ticket_title: ticket_title,
      is_donation: [null, null, null, null],
      promocode: promocodes,
      seats: this.state.attendees,
      payment_method: 'offline',
    };

    let config = {
      url: ApiUrl.bookTickect,
      method: 'post',
      body: data,
    };

    APIRequest(
      config,

      async res => {
        this.setState({ isloading: false });

        if (res.status) {
          if (type == '1') {
            Toast.show({
              type: 'info',
              text1: res?.message
            })
            if (res.message == 'Congrats! Booking Successful.') {
              this.props?.navigation?.navigate('ticketsScreen');
            } else {
              // if (res?.clientToken) {
              //   setTimeout(async () => {
              //     await BraintreeDropIn.show({
              //       clientToken: res?.clientToken,
              //       merchantIdentifier: 't29vnqfp3tdh7r44d',
              //       googlePayMerchantId: 'googlePayMerchantId',
              //       countryCode: 'US', //apple pay setting
              //       currencyCode: 'USD', //apple pay setting
              //       merchantName: 'Your Merchant Name for Apple Pay',
              //       orderTotal: this.calculatetotal(),
              //       googlePay: false,
              //       applePay: false,
              //       vaultManager: true,
              //       payPal: true,
              //       cardDisabled: true,
              //       darkTheme: true,
              //     })
              //       .then(result => {
              //         this.setState({ isloading: true });

              //         var dd = {
              //           transaction_id: res?.transaction_id,
              //           paymentMethodNonce: result?.nonce,
              //         };
              //         let config = {
              //           url: ApiUrl.paypalProcessPayment,
              //           method: 'post',
              //           body: dd,
              //         };

              //         APIRequest(
              //           config,

              //           res => {
              //             this.setState({ isloading: false });

              //             if (res.status) {
              //               this.setState({ successmoda: true });
              //             }
              //           },
              //           err => {
              //             this.setState({ isloading: false });

              //             console.log(err);
              //           },
              //         );
              //       })

              //       .catch(error => {
              //         console.log(error);
              //         Toast.show({
              //           type: 'error',
              //           text1: error.code
              //         })
              //         this.setState({ isloading: false });

              //         if (error.code === 'USER_CANCELLATION') {
              //         } else {
              //         }
              //       });
              //   }, 1000);
              // }
            }
          } else {
            if (res?.message == 'Congrats! Booking Successful.') {
              Toast.show({
                type: 'success',
                text1: 'Congrats! Booking Successful.'
              })
              this.props?.navigation?.navigate('ticketsScreen');
            } else {
              console.log(res?.url);
              this.setState({ paymenturl: res?.url });
            }
          }
        }
      },
      err => {
        this.setState({ isloading: false });
        console.log(err?.response);
        Toast.show({
          type: 'error',
          text1: 'Something went wrong'
        })
      },
    );
  };

  bookTickects = () => {
    if (this.state.attendees.length > 0) {
      var hasError =  false; 
      for (let index = 0; index < this.state.attendees.length; index++) {
        if (!this.state.attendees[index].name) {
          hasError =  true; 
          Toast.show({
            type: 'info',
            text1: 'Please Enter Name'
          })
        } else if (!this.state.attendees[index].phone) {
          hasError =  true; 
          Toast.show({
            type: 'info',
            text1: 'Please Enter Mobile No.'
          })
        } else if (!this.state.attendees[index].address) {
          hasError =  true; 
          Toast.show({
            type: 'info',
            text1: 'Please Enter Address'
          })
        }
      }
      if(!hasError){
        this.bookticket('7');
      }else{
        Toast.show({
          type: 'info',
          text1: 'Please fill all required Info'
        })
      }
    }else{
      Toast.show({
        type: 'info',
        text1: 'Please Add Attendee'
      })
    }
  }

  checkpromo = id => {
    let index = this.state.ticketList.findIndex(v => v.ticket_id == id);

    return index;
  };

  applycoupan = item => {
    if (item.promocodeText != '') {
      this.setState({ isloading: true });
      let formData = new FormData();
      formData.append('promocode', item.promocodeText);
      formData.append('ticket_id', item?.id);
      formData.append('customer_id', this.state.user_id);

      let config = {
        url: ApiUrl.applyPromocode,
        method: 'post',
        body: formData,
      };

      APIRequestWithFile(
        config,

        res => {
          console.log(res);
          if (res.status) {
            const { ticketList } = this.state;
            const ticket = { ...item, promocode: res.promocode };
            const newTicket = ticketList.map(t =>
              t.ticketId == ticket.id ? { ...t, item: ticket } : t,
            );
            const currentSelectedTicket = ticketList.find(
              t => t.ticketId == ticket.id,
            );
            this.setState({ ticketList: newTicket });
            this.handleSelectValue(
              currentSelectedTicket.value,
              ticket,
              '',
              'NO',
            );
            Toast.show({
              type: 'success',
              text1: 'Promocode Applied successfully'
            })
            this.setState({ isloading: false });
          } else {
            Toast.show({
              type: 'info',
              text1: 'Promocode is invalid'
            })
            this.setState({ isloading: false });
          }
        },
        err => {
          this.setState({ isloading: false });

          console.log(err);
        },
      );
    } else {
      Toast.show({
        type: 'info',
        text1: 'Please Enter PromoCode'
      })
    }
  };
  removeCoupan = item => {
    const { ticketList } = this.state;
    const ticket = { ...item, promocode: null, promocodeText: '' };
    const newTicket = ticketList.map(t =>
      t.ticketId == ticket.id ? { ...t, item: ticket } : t,
    );
    const currentSelectedTicket = ticketList.find(t => t.ticketId == ticket.id);
    this.setState({ ticketList: newTicket });
    this.handleSelectValue(currentSelectedTicket.value, ticket, '', 'NO');
    Toast.show({
      type: 'info',
      text1: 'Promocode removed successfully'
    })
  };

  checkTaxesIsAvailable = item => {
    let ticket =
      this.state.ticketList.length > 0
        ? this.state.ticketList.find(
          t => t.ticketId == item.id && t.value > 0 && t.item.price > 0.0,
        )
        : null;
    if (ticket == null || ticket == undefined) {
      return 0;
    } else {
      return ticket?.item?.taxes?.length;
    }
    // return tikcet.length;
  };

  getTicketTaxes = item => {
    if (this.state.ticketList.length > 0) {
      let ticket = this.state.ticketList.find(t => t.ticketId == item.id);
      if (ticket != 'undefined') {
        const taxes = ticket?.item?.taxes.map(tax => {
          let taxAmount = 0;
          if (tax.rate_type === 'percent') {
            taxAmount =
              (parseFloat(tax.rate) / 100) *
              (ticket.item.sale_start_date
                ? this.checkSaleIslive(ticket.item)
                  ? ticket.item.sale_start_date
                  : ticket.item.price
                : ticket.item.price);
          } else {
            taxAmount = parseFloat(tax.rate);
          }
          return (
            <Text key={tax?.id}>
              {`${parseFloat(taxAmount * ticket.value).toFixed(2)} ${this.state.currency
                } ( ${tax.title} ${parseFloat(tax.rate).toFixed(2)} ${tax?.rate_type == 'percent' ? '%' : this.state.currency
                } ${tax.net_price == 'excluding' ? 'exclusive' : 'inclusive'
                } )`}{' '}
            </Text>
          );
        });
        return taxes;
      }
    }
  };

  getQtyText = item => {
    const qty =
      this.state.ticketList.length > 0
        ? this.state.ticketList
          .filter(t => t.ticketId == item.id)
          .reduce((pre, curr) => pre + parseInt(curr.value), 0)
        : null;
    return qty > 0 ? `${qty} x ` : '';
  };

  checkPromocodeIsAvailable = item => {
    let ticket =
      this.state.ticketList.length > 0
        ? this.state.ticketList.find(
          t => t.ticketId == item.id && t.value > 0 && t.item.price > 0.0,
        )
        : null;
    if (ticket == null || ticket == undefined) {
      return 0;
    } else {
      return ticket?.item ? 1 : 0;
    }
  };

  onChangePromocode = (promocodeText, item) => {
    const { tickets_data } = this.state;
    const ticket = { ...item, promocodeText: promocodeText };
    const newTickets = tickets_data?.tickets?.map(t =>
      t.id == ticket.id ? ticket : t,
    );
    const newTickestData = {
      ...tickets_data,
      tickets: newTickets,
    };
    this.setState({ tickets_data: newTickestData });
  };

  checkPromocodeIsAppiled = item => {
    const { ticketList } = this.state;
    const ticket = ticketList.find(t => t.ticketId == item.id);
    if (
      ticket !== undefined &&
      (ticket?.item?.promocode !== undefined ||
        ticket?.item?.promocode !== null)
    ) {
      return ticket?.item?.promocode ? ticket?.item?.promocode?.code : null;
    } else return null;
  };

  addAttendee = (item, seat, value) => {
    let { attendees } = this.state;
    if (seat == "") {

      const otherticketHasAttendee = attendees.filter(
        t => t.ticket_id != item.id,
      );
      const ticketHasAttendee = attendees.filter(t => t.ticket_id == item.id);
      var ticketAttendees = [];
      if (ticketHasAttendee.length > 0) {
        if (value < ticketHasAttendee.length) {
          ticketAttendees = ticketHasAttendee.slice(0, value);
        }
        if (value > ticketHasAttendee.length) {
          let added = [];
          for (
            let index = 0;
            index < parseInt(value - ticketHasAttendee.length);
            index++
          ) {
            let data = {
              id: ticketHasAttendee.length + (index + 1),
              ticket_id: item.id,
              seat_id: seat !== '' ? seat.id : '',
              name: '',
              phone: '',
              address: '',
            };
            added.push(data);
          }
          ticketAttendees = ticketHasAttendee.concat(added);
        }
      } else {
        for (let index = 0; index < parseInt(value); index++) {
          let data = {
            id: index + 1,
            ticket_id: item.id,
            seat_id: seat !== '' ? seat.id : '',
            name: '',
            phone: '',
            address: '',
          };

          ticketAttendees.push(data);
        }
      }
      if (otherticketHasAttendee?.length > 0) {
        const findalData = otherticketHasAttendee.concat(ticketAttendees);
        const data = findalData.map((element, it) => ({ ...element, id: it + 1 }));
        this.setState({ attendees: data });
      } else {
        this.setState({ attendees: ticketAttendees });
      }
    } else {
      let updatedAttendees = [];
      let ticketHasAttendee = attendees.filter(t => t.ticket_id == item.id && t.seat_id == seat.id);
      if (ticketHasAttendee?.length > 0) {
        updatedAttendees = attendees.filter(t => t.ticket_id == item.id && t.seat_id != seat.id);
        this.setState({ attendees: updatedAttendees });

      } else {
        const tdta = {
          id: ticketHasAttendee?.length + 1,
          ticket_id: item.id,
          seat_id: seat !== '' ? seat.id : '',
          name: '',
          phone: '',
          address: '',
        };
        updatedAttendees = attendees.concat([tdta]);
        this.setState({ attendees: updatedAttendees });
      }

    }
  };

  handleAttendeeChange = (v, seat, name) => {
    let { attendees } = this.state;
    const newSeatData = { ...seat, [name]: v };
    const updatedAttendees = attendees.map(a =>
      a.id == newSeatData.id ? newSeatData : a,
    );
    this.setState({ attendees: updatedAttendees });
  };

  checkSaleIslive = date => {
    const saleStartDate = moment(date.sale_start_date);
    const saleEndDate = moment(date.sale_end_date);
    const currentTime = moment();
    return currentTime.isBetween(saleStartDate, saleEndDate, 'seconds', '[]');
  };
  getSaleExpirationSeconds(originTime) {
    const eventDateTime = moment(originTime);
    const currentDateTime = moment();
    return eventDateTime.diff(currentDateTime, 'seconds');
  }
  render() {
    const getSeatBacgroundColor = seat => {
      const { ticketList } = this.state;
      var bgc = 'transparent';
      if (seat?.status) {
        if (seat?.is_booked) {
          bgc = 'red';
        } else {
          const selectedAny = ticketList.find(
            t => t.ticketId == seat.ticket_id,
          );

          if (
            selectedAny !== undefined &&
            selectedAny?.seat_ids?.includes(seat.id)
          ) {
            bgc = 'green';
          }
        }
      } else {
        bgc = 'grey';
      }
      return bgc;
    };

    const getTextColor = seat => {
      const { ticketList } = this.state;
      var bgc = 'green';
      if (seat?.status) {
        if (seat?.is_booked) {
          bgc = 'white';
        } else {
          const selectedAny = ticketList.find(
            t => t.ticketId == seat.ticket_id,
          );

          if (
            selectedAny !== undefined &&
            selectedAny?.seat_ids?.includes(seat.id)
          ) {
            bgc = 'white';
          }
        }
      } else {
        bgc = 'white';
      }
      return bgc;
    };

    const getListTicketQuantity = item => {
      let list = [];
      let OTNPrice = 0;
      let maxLength = this.state.max_ticket_qty;
      if (maxLength > item?.quantity) {
        maxLength = item?.quantity;
      }
      for (let i = 1; i <= maxLength; i++) {
        list.push({ label: JSON.stringify(i), value: i, id: item.id, OTNPrice });
      }
      return list;
    };

    return (
      <SafeAreaView edges={['right', 'left', 'top']} style={{ flex:1, backgroundColor: color.white }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={color.white} />
        <Header title="Buy Ticket" />
        {this.state.paymenturl != null ? (
          <View style={{ flex:1 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => this.setState({ paymenturl: null })}>
                <Image
                  source={IMAGE.back}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Payment</Text>
              <Text style={{ color: '#fff' }}>ssss</Text>
            </View>
            <WebView
              ref="webview"
              source={{
                uri: this.state.paymenturl,
              }}
              onNavigationStateChange={navState => {
                // Keep track of going back navigation within component
                console.log('navstate', navState);
                if (navState?.url == ApiUrl.pay360CallbackSuccess) {
                  this.setState({ paymenturl: null, successmoda: true });
                }
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={false}
            />
          </View>
        ) : (
          <View style={{ flex: 1, zIndex:-1}}>
              <ScrollView>
                <View style={styles.container}>
                  <Loader type="dots" isLoading={this.state.isloading} />

                  <View style={{ marginHorizontal: '4%', marginVertical: 0 }}>
                    {/* <View style={styles.divider}></View> */}
                    <Text style={styles.upperText}>Event Category</Text>
                    <Text style={styles.bottomText}>
                      {this.state.ticketDetail.title}
                    </Text>
                    <View style={styles.divider}></View>
                    <Text style={styles.upperText}>Venue</Text>
                    <Text style={styles.bottomText}>
                      {this.state.ticketDetail.venue},{' '}
                      {this.state.ticketDetail.city},
                      {this.state.ticketDetail.state},{' '}
                      {this.state.ticketDetail.zipcode}
                    </Text>
                    <View style={styles.divider}></View>
                    <Text style={styles.upperText}>Start - End Date</Text>
                    <Text style={styles.bottomText}>
                      {moment(this.state?.from_date).format('ddd MMM YYYY')} -{' '}
                      {moment(this.state.to_date).format('ddd MMM YYYY')}
                    </Text>
                    <View style={styles.divider}></View>
                    <Text style={styles.upperText}>Timings</Text>
                    <Text style={styles.bottomText}>
                      {moment(
                        `${this.state?.from_date} ${this.state.from_time}`,
                      ).format('h:mm A')}{' '}
                      -{' '}
                      {moment(
                        `${this.state.to_date} ${this.state.to_time}`,
                      ).format('h:mm A')}{' '}
                      (IST)
                    </Text>
                    <View style={styles.divider}></View>
                    <Text style={styles.upperText}>Tickets </Text>

                    {this.state.tickets_data?.tickets?.length > 0 &&
                      this.state.tickets_data?.tickets?.map((item, index) => {
                        return (
                          <>
                            <View style={styles.ticketNameWrapper}>
                              <View style={{ flexDirection: 'column' }}>
                                <Text
                                  style={styles.bottomText1}
                                  numberOfLines={2}>
                                  {item?.title}
                                </Text>

                                {this.checkSaleIslive(item) && (
                                  <View style={styles.saleLabelView}>
                                    <Text style={styles.saleLabel}>
                                      ON SALE
                                    </Text>
                                  </View>
                                )}
                              </View>
                              {this.checkSaleIslive(item) && (
                                <View style={styles.saleWrapper}>
                                  <CountDown
                                    until={this.getSaleExpirationSeconds(
                                      item?.sale_end_date,
                                    )}
                                    size={15}
                                    // onFinish={() => this.saleFinished()}
                                    digitTxtStyle={{ color: color.btnBlue }}
                                    digitStyle={{
                                      backgroundColor: '#fff',
                                      marginTop: 0,
                                    }}
                                    timeLabelStyle={{
                                      fontSize: 12,
                                      fontFamily: fontFamily.Semibold,
                                      color: '#000',
                                    }}
                                    timeToShow={['D', 'H', 'M', 'S']}
                                    timeLabels={{
                                      d: 'D',
                                      h: 'H',
                                      m: 'M',
                                      s: 'S',
                                    }}
                                  />
                                </View>
                              )}
                            </View>
                            <View style={styles.ticketNameWrapper}>
                              <View>
                                <Text
                                  style={
                                    this.checkSaleIslive(item)
                                      ? styles.ticketPriceOld
                                      : {}
                                  }
                                  >
                                  <View 
                                  // style={styles.ticketQtyWrapper}
                                  >
                                    <Text style={{ marginRight: 5 }}>
                                      {!this.checkSaleIslive(item)
                                        ? this.getQtyText(item)
                                        : null}
                                    </Text>
                                    <Text
                                      style={
                                        !this.checkSaleIslive(item)
                                          ? {}
                                          : {
                                            ...styles.ticketQtyWrapper,
                                            fontSize: 10,
                                            textDecorationLine:
                                              'line-through',
                                          }
                                      }>
                                      {item?.price} {this.state.currency}
                                    </Text>
                                  </View>
                                </Text>
                                {this.checkSaleIslive(item) && (
                                  <Text>
                                    {this.getQtyText(item)}
                                    {item?.sale_price}
                                    {this.state.currency}
                                  </Text>
                                )}
                              </View>

                              {!item?.seatchart && (
                                <View>
                                  <RNPickerSelect
                                    fixAndroidTouchableBug={true}
                                    placeholder={{
                                      label: 'Qty',
                                      value: 0,
                                    }}
                                    onValueChange={value => {
                                      this.handleSelectValue(
                                        value,
                                        item,
                                        '',
                                        'YES',
                                      );
                                    }}
                                    items={getListTicketQuantity(item).map(
                                      (list, i) => ({
                                        label: `${list.label} ${list.value == 1 ? 'Ticket' : 'Tickets'
                                          }`,
                                        value: list.value,
                                        key: i,
                                      }),
                                    )}
                                    style={{
                                      ...pickerStyle,
                                      iconContainer: {
                                        top: 10,
                                        right: 10,
                                      },
                                    }}
                                    useNativeAndroidPickerStyle={false}
                                    Icon={() => {
                                      return (
                                        <Image
                                          source={IMAGE.dropDown}
                                          style={styles.dropDownIcon}
                                        />
                                      );
                                    }}
                                  />
                                </View>
                              )}
                            </View>
                            {item?.show_sheat_chart && (
                              <>
                                <View
                                  style={styles.seatingAvailabilityContainer}>
                                  <View style={styles.bookedContainer}></View>
                                  <Text
                                    style={[
                                      styles.seatingText,
                                      { marginRight: 5, marginLeft: 2 },
                                    ]}>
                                    Disabled
                                  </Text>
                                  <View style={styles.bookedContainer1}></View>
                                  <Text
                                    style={[
                                      styles.seatingText,
                                      { marginRight: 5, marginLeft: 2 },
                                    ]}>
                                    Reserved
                                  </Text>
                                  <View style={styles.bookedContainer2}></View>
                                  <Text
                                    style={[
                                      styles.seatingText,
                                      { marginRight: 5, marginLeft: 2 },
                                    ]}>
                                    Available
                                  </Text>
                                  <View style={styles.bookedContainer3}></View>
                                  <Text
                                    style={[
                                      styles.seatingText,
                                      { marginRight: 5, marginLeft: 2 },
                                    ]}>
                                    Selected
                                  </Text>
                                </View>
                                <ScrollView
                                  // contentContainerStyle={{flex: 1}}
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  style={styles.seatWrapper}>
                                  <View
                                    style={{
                                      height:
                                        item?.seatchart?.canvas_size?.height,
                                      width:
                                        item?.seatchart?.canvas_size?.width,
                                      backgroundColor: '#f1f1f1',
                                      borderColor: 'white',
                                      borderRadius: wp(1),
                                      position: 'relative',
                                    }}>
                                    {item?.seatchart?.seats.map(
                                      (seat, index) => {
                                        return (
                                          <TouchableOpacity
                                            disabled={
                                              seat?.status == 0 ||
                                              seat?.is_booked
                                            }
                                            key={seat?.id}
                                            index={index}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              position: 'absolute',
                                              height: 24,
                                              width: 24,
                                              backgroundColor:
                                                getSeatBacgroundColor(seat),
                                              borderWidth: 1,
                                              borderColor: seat?.status
                                                ? seat?.is_booked
                                                  ? 'red'
                                                  : 'green'
                                                : 'grey',
                                              borderRadius: 5,
                                              marginTop:
                                                seat?.coordinates?.top - 12,
                                              marginLeft:
                                                seat?.coordinates?.left - 12,
                                            }}
                                            onPress={() =>
                                              this.handleSelectValue(
                                                1,
                                                item,
                                                seat,
                                                'YES',
                                              )
                                            }>
                                            <Text
                                              style={{
                                                color: getTextColor(seat),
                                                fontSize: 9,
                                                fontWeight: 'bold',
                                              }}>
                                              {seat?.name}
                                            </Text>
                                          </TouchableOpacity>
                                        );
                                      },
                                    )}
                                  </View>
                                </ScrollView>
                              </>
                            )}
                            <GenrateAttendee
                              item={item}
                              attendees={this.state.attendees}
                              handleAttendeeChange={(v, seat, name) =>
                                this.handleAttendeeChange(v, seat, name)
                              }
                            />
                            {this.checkTaxesIsAvailable(item) > 0 && (
                              <View style={styles.taxesContiner}>
                                {this.getTicketTaxes(item)}
                              </View>
                            )}
                            {this.checkPromocodeIsAvailable(item) > 0 &&
                              parseFloat(this.state.grandTotal) >= 0.0 && (
                                <>
                                  {this.checkPromocodeIsAppiled(item) ===
                                    null ? (
                                    <>
                                      <Text
                                        style={[
                                          styles.upperText,
                                          { marginTop: 10 },
                                        ]}>
                                        Add Promocode
                                      </Text>
                                      <View style={styles.backInput}>
                                        <View style={{ width: '60%' }}>
                                          <TextInput
                                            placeholder="Enter Promocode"
                                            placeholderTextColor="gray"
                                            labelStyle={styles.label}
                                            style={{
                                              paddingTop: 10,
                                              paddingLeft: 10,
                                            }}
                                            textContentType="emailAddress"
                                            onChangeText={promocodeText => {
                                              this.onChangePromocode(
                                                promocodeText,
                                                item,
                                              );
                                            }}
                                            value={item?.promocode}
                                          />
                                        </View>
                                        <TouchableOpacity
                                          style={styles.applyButton}
                                          onPress={() => {
                                            this.applycoupan(item);
                                          }}>
                                          <Text style={styles.applyText}>
                                            Apply
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </>
                                  ) : (
                                    <View style={styles.backInput}>
                                      <View
                                        style={{
                                          width: '60%',
                                          justifyContent: 'center',
                                        }}>
                                        <View
                                          style={{
                                            marginLeft: 15,
                                            // backgroundColor: '#f2f2f2',
                                            width: wp(50),
                                          }}>
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              justifyContent: 'space-between',
                                            }}>
                                            <Text
                                              style={{
                                                paddingHorizontal: 10,
                                                paddingVertical: 5,
                                                backgroundColor: '#5CB35C',
                                                borderRadius: wp(2),
                                                color: '#fff',
                                                fontSize: 12,
                                              }}
                                              numberOfLines={1}>
                                              {this.checkPromocodeIsAppiled(
                                                item,
                                              )}
                                            </Text>
                                          </View>
                                        </View>
                                      </View>

                                      <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => {
                                          this.removeCoupan(item);
                                        }}>
                                        <Text style={styles.applyText}>
                                          Remove
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </>
                              )}
                            <View style={styles.divider}></View>
                          </>
                        );
                      })}

                    <View style={styles.totalTicketMainContainer}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: fontFamily.Medium,
                          color: color.black,
                          marginVertical:20,
                        }}>
                        Payment Info
                      </Text>
                      <View style={styles.totalTicketContainer}>
                        <Text style={styles.totalTicketText}>
                          No. of tickets
                        </Text>

                        <Text style={styles.totalTicketText}>
                          {this.state.ticketList.reduce(
                            (pre, curr) => pre + parseInt(curr.value),
                            0,
                          )}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.totalTicketMainContainer}>
                      <View style={styles.totalTicketContainer}>
                        <Text style={styles.totalTicketText}>Sub total</Text>
                        <Text style={styles.totalTicketText}>
                          {this.state.totalPrice} {this.state.currency}
                        </Text>
                      </View>
                      <View style={styles.totalTicketContainer}>
                        <Text style={styles.totalTicketText}>Platform fee</Text>

                        <Text style={styles.totalTicketText}>
                          {this.state.taxAmount} {this.state.currency}
                        </Text>
                      </View>
                      <View style={styles.totalTicketContainer}>
                        <Text style={styles.totalTicketText}>Total amount</Text>
                        <Text style={styles.totalTicketText}>
                          {this.state.grandTotal} {this.state.currency}
                        </Text>
                      </View>
                      {this.state.promocodeDiscount > 0 && (
                        <>
                          <View style={styles.totalTicketContainer}>
                            <Text style={styles.totalTicketText}>
                              Promocode Discount
                            </Text>
                            <Text style={styles.discountOnTicketText}>
                              - {this.state.promocodeDiscount}{' '}
                              {this.state.currency}
                            </Text>
                          </View>
                          <View style={styles.totalTicketContainer}>
                            <Text style={styles.totalTicketText}>
                              Net Payable Amount
                            </Text>
                            <Text style={styles.totalTicketText}>
                              {this.state.netTotal} {this.state.currency}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                    {/* <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: "8%"
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: fontFamily.Medium,
                            color: color.black,
                          }}>
                          Total Tickets
                        </Text>
                        <Text style={styles.amountText}>
                          {this.calculatetotal()} GBP
                        </Text>
                      </View>
                      {this.state.promoapplied?.length > 0 && (
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: fontFamily.Medium,
                            color: color.black,
                            marginTop: 10,
                          }}>
                          Promo Code Applied:
                        </Text>
                      )}
                      {this.state.promoapplied?.map((ite, ind) => {
                        if (ite != null)
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: "10%"
                              }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: fontFamily.Medium,
                                  color: color.black,
                                }}>
                                Coupon ({ite?.code})
                              </Text>
                              <Text style={styles.amountText}>
                                ({ite?.p_type == 'percent' ? '%' : '-'})  {ite?.reward}
                              </Text>
                            </View>
                          );
                      })} */}
                    {/* <View style={styles.divider}></View> */}
                  </View>
                  <Modal
                    transparent={true}
                    animationType={'fade'}
                    visible={this.state.successmoda}>
                    <View style={styles.modalBackground}>
                      <View style={styles.activityIndicatorWrapper}>
                        <Image
                          style={{ width: 50, height: 50 }}
                          resizeMode={'contain'}
                          source={require('../../assets/images/checkNewg.png')}
                        />
                        <Text
                          style={{
                            color: 'green',
                            fontSize: 20,
                            marginTop: 60,
                            fontFamily: fontFamily.Bold,
                          }}>
                          Payment Successful
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.props?.navigation?.navigate('ticketsScreen');
                          }}
                          style={{
                            backgroundColor: '#20bbf6',
                            borderRadius: 20,
                            paddingHorizontal: 60,
                            marginTop: 10,
                            paddingVertical: 8,
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontFamily: fontFamily.Medium,
                            }}>
                            View Ticket
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              </ScrollView>
              {this.state.paymenturl == null && (
                  <View style={{ flexDirection: 'row' }}>
                    {/* <TouchableOpacity
                      onPress={() => {
                        this.bookticket('1');
                      }}
                      // onPress={()=>this.props.navigation.navigate("buyTicket")}
                      style={{
                        height: 46,
                        width: '50%',
                        backgroundColor: '#20BBF6',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.buttonText}>Pay by Paypal</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() => {
                        this.bookTickects();
                      }}
                      // onPress={()=>this.props.navigation.navigate("buyTicket")}
                      style={{
                        height: hp(7),
                        width: '100%',
                        backgroundColor: color.btnBlue,
                        borderWidth: 1,
                        borderColor: color.btnBlue,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={[styles.buttonText, { color: '#fff' }]}>
                        Buy now
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const pickerStyle = StyleSheet.create({
  inputIOS: {
    height: 30,
    minWidth: 70,
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 30,
    minWidth: 70,
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    elevation: 10,
    backgroundColor: '#FFFFFF',
    height: 300,
    width: 300,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(110, 110, 110, 0.6)',
  },
  container: {
    flex: 1,
    width: null,
    backgroundColor: '#fff',
    paddingVertical:15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Platform.OS == 'ios' ? 0 : 0,
  },
  headerText: {
    fontSize: 15,
    fontFamily: fontFamily.Bold,
    color: '#0F0F0F',
  },
  divider: {
    height: 1,
    width: '200%',
    backgroundColor: color.borderGray,
    marginHorizontal: '-10%',
    marginVertical: '5%',
  },
  upperText: {
    fontSize: 16,
    fontFamily: fontFamily.Semibold,
    color: color.black,
  },
  bottomText: {
    fontSize: 14,
    fontFamily: fontFamily.Regular,
    color: color.black,
    marginTop: '2%',
  },
  ticketNameWrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomText1: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.black,
    marginTop: '2%',
    // backgroundColor:"red"
  },
  saleLabelView: {
    alignSelf: 'flex-start',
    backgroundColor: color.green,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
  },
  saleLabel: {
    fontSize: 10,
    color: color.white,
    fontFamily: fontFamily.Semibold,
  },
  downIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1%',
  },
  inputFiedContainer: {
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    height: 34,
    borderWidth: 0,
    borderColor: '#8A8787',
    width: '100%',
    alignSelf: 'center',
  },
  seatingAvailabilityContainer: {
    marginVertical: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    color: color.black,
    fontSize: 13,
    marginHorizontal: 10,
    // fontFamily:global.FONT.REGULAR,
    marginTop: '2%',
  },
  bookedContainer: {
    borderRadius: 4,
    height: 15,
    width: 15,
    backgroundColor: 'grey',
  },
  bookedContainer1: {
    borderRadius: 4,

    height: 15,
    width: 15,
    backgroundColor: 'red',
  },
  bookedContainer2: {
    borderRadius: 4,
    height: 15,
    width: 15,
    backgroundColor: '#f2f2f2',
  },
  bookedContainer3: {
    borderRadius: 4,
    height: 15,
    width: 15,
    backgroundColor: 'green',
  },
  seatingText: {
    color: 'gray',
    fontSize: widthPercentageToDP(3),
    fontWeight: '700',
  },
  backInput: {
    height: 41,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 10,
    marginTop: '4%',
    marginBottom: '8%',
  },
  applyText: {
    fontSize: 15,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  applyButton: {
    backgroundColor: color.btnBlue,
    height: 40,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-0.2%',
    marginLeft: '1%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  removeButton: {
    backgroundColor: '#d14e4e',
    height: 40,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-0.2%',
    marginLeft: '1%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  inputContainerOverlay: {
    flexDirection: 'row',
    marginRight: 20,
    marginTop: '6%',
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#DEDEDE',
    height: 51.25,
    marginHorizontal: '5%',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  inputFiedContainerOverlay: {
    borderBottomWidth: 0,
    height: 45,
    marginLeft: -40,
    paddingLeft: 50,
    borderRadius: 8,
    width: '100%',
  },
  inputTextOverlay: {
    color: 'Gray',
    fontSize: 16,
    marginTop: '3%',
    marginLeft: '5%',
  },
  iconcontainer: {
    width: 45,
    height: 45,
    marginLeft: '-10%',
    zIndex: 9,
    borderColor: 'gray',
  },
  inputIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: '30%',
    // marginRight: '30%',
  },
  amountText: {
    fontSize: 19,
    fontFamily: fontFamily.Bold,
    color: color.black,
  },
  buttonText: {
    fontSize: fontSize.size15,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  overlayStyle: {
    // height:"80%",
    width: 60,
    backgroundColor: color.white,
    // marginBottom: "6%",
    // marginTop: "4%",
  },
  overlayText: {
    fontSize: 20,
    fontFamily: fontFamily.Bold,
    color: color.black,
    marginTop: '5%',
    textAlign: 'center',
  },
  dropDownIcon: {
    width: 10,
    height: 10,
  },
  taxesContiner: {
    flex: 1,
    backgroundColor: '#ddd',
    borderRadius: wp(2),
    padding: wp(2),
    marginBottom: hp(2),
    marginTop: hp(2),
  },
  totalTicketMainContainer: {
    // marginHorizontal: hp(2),
  },
  totalTicketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: wp(2),
    marginBottom:30,
  },
  totalTicketText: {
    fontSize: 15,
    fontFamily: fontFamily.Regular,
    color: '#000',
  },
  attendeeWrapper: {
    marginTop: 20,
    // marginHorizontal:wp(2),
    // marginVertical:wp(2),
    // backgroundColor:"#ddd",
    // borderRadius:wp(2)
  },
  ticketQtyWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
});
