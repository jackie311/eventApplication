import React from 'react';
import {
	AutoComplete,
	Input,
	Select,
	Steps,
	Button,
	message,
	Radio,
	Checkbox,
	Icon,
	Form,
	Tooltip
} from 'antd';
import { application, course } from '../../api';
const { TextArea } = Input;
const Step = Steps.Step;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const apiUrl = '/api/enrollment';
const config = require('../../../config/config.json');

export default class ContactsApp extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			phone: '',
			message: '',
			enquiryType: '',
			wechat:'',
			employmentStatus:'',
			submitted: false,
			dataSource: [],
			current: 0,
			location: 'brisbane',
			commenceDate: '',
			nameErr:false,
			emailErr:false,
			wechatErr:false,
			phoneErr:false
		};
		this.application ={};
		this.steps = this.buildSteps();
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.submitSecondApplication = this.submitSecondApplication.bind(this);
		this.submitInitApplication = this.submitInitApplication.bind(this);
		this.handlePhoneChange = this.handlePhoneChange.bind(this);
		this.handleEnquiryChange = this.handleEnquiryChange.bind(this);
		this.handleEmploymentStatusChange = this.handleEmploymentStatusChange.bind(this);
		this.handleCommenceDateChange = this.handleCommenceDateChange.bind(this);
		this.handleWeChatChange = this.handleWeChatChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.submitLastApplication = this.submitLastApplication.bind(this);
		this.handleMessage = this.handleMessage.bind(this);
		this.handleLinkedinUrl = this.handleLinkedinUrl.bind(this);
		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.handleCourseChange = this.handleCourseChange.bind(this);
	}

	componentDidMount () {
		course.getCourseList().then(item => {
			console.log(item);
			if(item) {
				this.setState({courseList: item});
			}
		});
	}

	handleNameChange (e) {
		if(e.target.value.trim().length === 0) {
			this.setState({
				nameErr:true
			});
		} else {
			this.setState({
				nameErr:false
			});
		}
		this.setState({
			name: e.target.value
		});
	}
	handleEmailChange (value) {
		const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(value.trim().length === 0 || regx.test(value) === false) {
			this.setState({
				emailErr:true
			});
		} else {
			this.setState({
				emailErr:false
			});
		}
		this.setState({
			dataSource: !value || value.indexOf('@') >0 ? [] : [
				`${value}@gmail.com`,
				`${value}@163.com`,
				`${value}@live.com`,
				`${value}@qq.com`,
				`${value}@hotmail.com`
			],
			email: value
		});
	}
	handleDescriptionChange (e) {
		this.setState({ description: e.target.value });
	}
	handleWeChatChange (e) {
		const value = e.target.value;
		if(value.trim().length === 0) {
			this.setState({
				wechatErr:true
			});
		} else {
			this.setState({
				wechatErr:false
			});
		}
		this.setState({ wechat: e.target.value });
	}
	handleEnquiryChange (value) {
		this.setState({enquiryType: value });
	}
	handleEmploymentStatusChange (value) {
		this.setState({employmentStatus: value });
	}
	handlePhoneChange (e) {
		const { value } = e.target;
		// const regx = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
		if(value.trim().length === 0) {
			this.setState({
				phoneErr:true
			});
		} else {
			this.setState({
				phoneErr:false
			});
		}
		this.setState({phone: value });
	}
	handleOptions (value) {
		console.log(value);
	}
	handleCommenceDateChange (e) {
		this.setState({commenceDate: e.target.value });
	}
	handleMessage (e) {
		this.setState({message: e.target.value });
	}
	handleLinkedinUrl (e) {
		this.setState( {linkedinUrl: e.target.value});
	}
	handleLocationChange (value) {
		this.setState( {location: value} );
	}
	handleCourseChange (value) {
		this.setState( {course: value} );
	}
	handleInputChange(e) {
		let type, value, name;
		if(e.length>0){
			type = 'checkbox';
			name = 'questionSets'
			value = e;
		}else{
			type = 'radio';
			name = e.target.name;
			value = e.target.value;
		}
		if(this.state.experience) {
			Object.assign(this.state.experience, {
				[name]: value
			});
		} else{
			this.setState({
				experience: {
					[name]: value
				}
			});
		}
	}

	submitInitApplication(e) {
		e.preventDefault();
		const {nameErr, phoneErr, wechatErr, emailErr}=this.state;
		const {name, email, phone, wechat} = this.state;
		// if(nameErr||phoneErr||wechatErr||emailErr||name===undefined||email===undefined||phone===undefined||wechat===undefined){
		// 	message.error('您的表格填写有误，请重新确认后再提交！');
		// 	return;
		// }

		const data = {
			name: name,
			email: email,
			phone: phone,
			wechat: wechat
		};
		application.submit(data).then(item => {
			if(item.status === 200) {
				Object.assign(this.application, item.data);
				this.next();
			}
		});
	}
	submitSecondApplication (e) {
		e.preventDefault();
		const data = {
			location: this.state.location,
			courseAlias: this.state.course,
			employmentStatus: this.state.employmentStatus
		};
		console.log(this.application._id)
		// experience: JSON.stringify(this.state.experience)
		this.updateApplication(this.application._id, data);
	}
	submitLastApplication (e) {
		e.preventDefault();
		console.log(this.state)
		const data = {
			message: this.state.message,
			enquiryType: this.state.enquiryType,
			linkedinUrl: this.state.linkedinUrl
		};
		this.updateApplication(this.application._id, data);
	}
	updateApplication(id, data) {
		console.log(data)
		const url = apiUrl+ '/' +id;
		return fetch(url, {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: 'PUT',
			body: JSON.stringify(data)
		})
		.then(response => (response.json()))
		.then(item => {
			console.log(item);
			if(item.status === 200) {
				this.next();
			}
		});
	}
	next() {
		const current = this.state.current + 1;
		this.setState({ current });
	}
	prev() {
		const current = this.state.current - 1;
		this.setState({ current });
	}
	buildSteps () {
		const emailContent = <p style={styles.errorTextStyle}>请填写有效的邮箱地址<br />例如:<br />john.doe@jiangren.com</p>;
		const nameContent = <p style={styles.errorTextStyle}>请填写有效的姓名<br />例如:<br />John Doe<br />张三</p>;
		const wechatContent = <p style={styles.errorTextStyle}>请填写有效的微信号<br />例如:<br />jiangren_bne</p>;
		const phoneContent = <p style={styles.errorTextStyle}>请填写有效的电话号码<br />例如:<br />0412345678</p>;
		return [{
			title: '个人信息',
			icon:'user',
			content: () =>{

				return (
					<Form className="contactForm jr-form" onSubmit={this.submitSecondApplication}>
						<p>你的姓名</p>
						<div className="input-group ppd-input-field" >
							<Tooltip title={nameContent} placement="right" visible={this.state.nameErr}>
								<Input type="text" style={this.state.nameErr?styles.errorStyle:null} className="form-control" placeholder="姓名" value={this.state.name} onChange={this.handleNameChange} maxLength="25"/>
							</Tooltip>
						</div>
						<p>你的电子邮箱</p>
						<div className="input-group ppd-input-field">
							<Tooltip title={emailContent} placement="right" visible={this.state.emailErr}>
								<AutoComplete dataSource={this.state.dataSource}  onChange={this.handleEmailChange} placeholder="Email" maxLength="25"/>
							</Tooltip>
						</div>
						<p>你的微信</p>
						<div className="input-group ppd-input-field">
							<Tooltip title={wechatContent} placement="right" visible={this.state.wechatErr}>
								<Input type="text" style={this.state.wechatErr?styles.errorStyle:null} className="form-control" placeholder="微信" value={this.state.wechat} onChange={this.handleWeChatChange} maxLength="25"/>
							</Tooltip>
						</div>
						<p>你的手机号码</p>
						<div className="input-group ppd-input-field">
							<Input type="text" style={this.state.phoneErr?styles.errorStyle:null} className="form-control" placeholder="电话" value={this.state.phone} onChange={this.handlePhoneChange} maxLength="13" />
						</div>
						<div className="text-center">
							<Button type="primary" onClick={this.submitInitApplication}>提交</Button>
						</div>
					</Form>
				);
			}
		}, {
			title: '个人调查',
			icon:'solution',
			content: () =>{
				const listEmploymentStatus = config.employmentStatus.map((item) => {
					return (
						<Select.Option key={item.value} value={item.value} >{item.label}</Select.Option>
					);
				});
				const listLocations = config.locations.map((item) => {
					return (
						<Select.Option key={item.value} value={item.value} >{item.label}</Select.Option>
					);
				});
				const listCourses = this.state.courseList.map((item) => {
					return (
						<Select.Option key={item.title} value={item.title} >{item.title}</Select.Option>
					);
				});
				const listExperienceQuestions = config.questionSets.applicationQuestionStes.map((item) => {
					if(item.type === 'checkbox') {
						return (
							<div className="">
								<p>{item.question}</p>
								<CheckboxGroup options={item.options} name={item.question} defaultValue={[0]} onChange={this.handleInputChange} />
							</div>
						);
					} else if(item.type === 'radio') {
						return (
							<div className="">
								<p>{item.question}</p>
								<RadioGroup options={item.options} name={item.question} defaultValue={[0]} onChange={this.handleInputChange} />
							</div>
						);
					}
				});
				return (
					<Form className="contactForm jr-form" onSubmit={this.submitSecondApplication}>
						<p>你在哪个城市？</p>
						<div className="input-group ppd-input-field">
							<Select defaultValue="brisbane" style={{ width: '100%' }} value={this.state.location} onChange={this.handleLocationChange}>
								{listLocations}
							</Select>
						</div>
						<p>哪一个课程你感兴趣？</p>
						<div className="input-group ppd-input-field">
							<Select defaultValue="6-x" style={{ width: '100%' }} value={this.state.course} onChange={this.handleCourseChange}>
								{listCourses}
							</Select>
						</div>
						<p>你现在的工作情况？</p>
						<div className="input-group ppd-input-field">
							<Select defaultValue="Students" style={{ width: '100%' }} value={this.state.employmentStatus} onChange={this.handleEmploymentStatusChange}>
								{listEmploymentStatus}
							</Select>
						</div>
						{/* <div className="experience-section">
							{listExperienceQuestions}
						</div> */}
						<div className="text-center">
							<Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
							上一步
							</Button>
							<Button type="primary" htmlType="submit">下一步</Button>
						</div>

					</Form>
				);
			}
		}, {
			title: '感谢申请',
			icon:'smile-o',
			content:  () =>{
				const listEnquiryTypes = config.enquiryType.map((item) => {
					return (
						<Select.Option key={item.value} value={item.value} >{item.label}</Select.Option>
					);
				});
				return (
					<Form className="contactForm jr-form" onSubmit={this.submitLastApplication}>
						<p>你从哪得知我们的呢？</p>
						<div className="input-group ppd-input-field">
							<Select defaultValue="seo" style={{ width: 220 }} value={this.state.enquiryType} onChange={this.handleEnquiryChange}>
								{listEnquiryTypes}
							</Select>
						</div>
						<p>你的Linkedin URL</p>
						<div className="input-group ppd-input-field">
							<Input type="text" className="form-control" name="linkedinUrl" placeholder="linkedin" value={this.state.linkedinUrl} onChange={this.handleLinkedinUrl}></Input>
						</div>
						<p>你有什么想告诉我们的吗</p>
						<div className="input-group ppd-input-field">
							<Input type="text" className="form-control" name="message" placeholder="i.e. I’m looking for a new career" value={this.state.message} onChange={this.handleMessage}></Input>
						</div>
						<div className="text-center">
							<Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
							上一步
							</Button>
							<Button type="primary" htmlType="submit" onClick={() => message.success('申请已经提交')}>提交</Button>
						</div>

					</Form>
				);
			}
		}];
	}
	render () {
		const { current } = this.state;
		const compleStyle ={
			color: '#fb325c',
			fontSize: '35px'
		}
		return (
			<div className="inputForm">
				{
					current <3
					&&<Steps current={current}>
							{this.steps.map(item => <Step key={item.title} title={item.title} icon={<Icon type= {item.icon} />} />)}
						</Steps>
					&&<div className="steps-content">{this.steps[this.state.current].content()}</div>
				}
				{
					current >2
					&&
					<div className="text-center">
						<Icon type="check-circle" style={compleStyle}/>
						<p></p>
						<p></p>
						<h3>感谢你对我们的信任</h3>
						<p>同时你也可以直接添加下面微信咨询哦</p>
						<img src="/images/小花.jpeg" alt="匠人小花"/>
					</div>
				}
			</div>
		);
	}
}

const styles = {
	errorStyle:{
		borderWidth: '2px',
		borderColor: '#F00'
	},
	errorTextStyle:{
		color:'#fff',
		marginBottom: 0,
		margin: '5px'
	}
};
