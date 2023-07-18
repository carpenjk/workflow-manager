import { useForm } from "react-hook-form";
import InlineLink from "./InlineLink";
import { LoginRequest, LoginRequestSchema, useGetUserDetailsQuery, useLoginMutation } from "../app/services/auth";
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ItemContainer from "./ItemContainer";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";

const LoginCard = () => {
  const { register, handleSubmit, formState: {errors: inputErrors }, getValues } = useForm<LoginRequest>( {resolver: yupResolver(LoginRequestSchema)});
  const navigate = useNavigate();
  const {data: loggedInUser} = useGetUserDetailsQuery();
  const [logIn, status] = useLoginMutation();
  
  
  useEffect(() => {
    if(loggedInUser?.email){
      navigate('/');
    }
  },[loggedInUser, navigate])

  const handleLogin = async () => {
    try{
      const {user} = await logIn({email: getValues("email"), password:getValues("password")}).unwrap();
      if(user)
      navigate('/')
    }
    catch(e){
      console.log(e);      
    }    
  }

  const getErrors = (): string => {
    if(status.error){
      if('data' in status.error && status.error?.data === 'Unauthorized'){
        return 'The email and password provided are invalid.'
      } else {
        return "Something went wrong."
      }
    }
    
    if(typeof inputErrors.email?.message === 'string'){
      return inputErrors.email?.message;
    }
    if(typeof inputErrors.password?.message === 'string') {
      return inputErrors.password?.message;
    }
    return "";
  }

  return ( 
    <ItemContainer >
      <h1 className="text-gray-100">Welcome Back!</h1>
      <h5>Standardize and track your most important work flows.</h5>
      <div className="w-full max-w-md p-4">
        <form className="w-full" onSubmit={handleSubmit(handleLogin)}>
          <div className="w-full mb-4">
            <TextInput
              id="email"
              label="Email"
              placeholder="example@email.com"
              {...register("email",  { required: true }) }
              tabIndex={1}
            />
          </div>
          <div className="relative pb-6">
            <TextInput
              id="password"
              label="Password"
              placeholder="******************"
              type="password"
              {...register("password",  { required: true }) }
              tabIndex={2}
            />
            <div className="absolute bottom-1">
              <p className="text-xs italic font-bold text-red-300">{getErrors()}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mb-6 space-y-2">
              <span className="text-sm">Or</span>
              <InlineLink to="/" tabIndex={4}>Login as Guest</InlineLink>
          </div>
          <div className="flex items-center justify-between mt-10 space-x-6">
          <SubmitButton tabIndex={3}>Sign In</SubmitButton>
            <div className="md:w-18">
              <InlineLink to="/register" tabIndex={4}>
                Don't have an account? Sign Up!
              </InlineLink>
            </div>
          </div>
        </form>
        </div>
    </ItemContainer>
  );
}
 
export default LoginCard;