import React from 'react';
import {eventApplication} from '../../api';
import {Button} from 'antd';

export default class EventApplication extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      wechat:'',
      message:'',
      nameErr:'',
			emailErr:'',
			wechatErr:'',
			phoneErr:''
    };
    this.handleNameChange = this.handleNameChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleWeChatChange = this.handleWeChatChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleNameChange(e){
    this.setState({name: e.target.value});
  }

  handleEmailChange(e){
    this.setState({email: e.target.value});
  }

  handlePhoneChange(e){
    this.setState({phone: e.target.value});
  }

  handleWeChatChange(e){
    this.setState({wechat: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    let validateform = false;
    const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const data = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      wechat: this.state.wechat
      };

    if (data.name ===""||data.name===null) {
      this.setState({nameErr: "用户名不能为空"})
    } else if (regx.test(data.email) == false) {
      this.setState({emailErr: "请您填写正确的邮箱地址"})
    } else if (data.wechat ===""||data.wechat===null){
      this.setState({wechatErr: "请填写您的微信号"})
    } else if (data.phone ===""||data.phone===null){
      this.setState({phoneErr: "请留下您的联系方式"})
    } else {
      validateform = true
    }


    if (validateform){
      eventApplication.submit(data).then(item => {
        if(item.status === 200) {
          Object.assign(this.application, item.data);
          }
      });
      alert("your allpication is already submmited");
    }
}




  render(){
    return (
      <form className="contactForm jr-form" >
        <p>你的姓名</p>
        <div className="input-group ppd-input-field" >
          <input type="text"   placeholder="姓名" value={this.state.name} onChange={this.handleNameChange} maxLength="25" />
          <span className="form-validation">{this.state.nameErr}</span>
        </div>
        <p>你的电子邮箱</p>
        <div className="input-group ppd-input-field">
          <input type="text" onChange={this.handleEmailChange} placeholder="Email" maxLength="25" />
          <span className="form-validation">{this.state.emailErr}</span>
        </div>
        <p>你的微信</p>
        <div className="input-group ppd-input-field">
          <input type="text"   placeholder="微信" value={this.state.wechat} onChange={this.handleWeChatChange} maxLength="25" />
          <span className='form-validation'>{this.state.wechatErr}</span>
        </div>
        <p>你的手机号码</p>
        <div className="input-group ppd-input-field">
          <input type="text"   placeholder="电话" value={this.state.phone} onChange={this.handlePhoneChange} maxLength="13" />
          <span className='form-validation'>{this.state.phoneErr}</span>
        </div>
        <div className="text-center">
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>提交</Button>
        </div>
      </form>
    );
  }
}
