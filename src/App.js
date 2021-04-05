import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import { Button, TextField, crukTheme, Select } from "@cruk/cruk-react-components";
import { checkHttpStatus, parseJSON } from "./utils.js";
import "./App.css";

const SiteWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

function App() {
  const formSchema = yup.object().shape({
    keywords: yup.string()
      .min(2,"Too Short, Mininum 2 characters")
      .max(50,"Too Long, Maximum 50 characters")
      .required("Please enter keywords to search."),  

    mediaType: yup.string()
      .oneOf(
        ['audio', 'video', 'image'],
        'Please select a media type.'
      )
      .required("Please select a media type."),

    yearStart: yup.date().max(
      new Date().getFullYear(),
      "Year must be current year or past year"
    )
    
  });

 

  const [imageList, setImageList] = useState([]);

 


  const handleSubmit = async (values) => {
     console.log(values);

     const nasaBaseUrl = 'https://images-api.nasa.gov/search?';


    console.log('onSubmitClick',values);

    let url = nasaBaseUrl + "media_type=" + values.mediaType + "&q=" + values.keywords + "&year_start="+values.yearStart;
		await fetch(url)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(resp => {
        console.log(resp.collection.items)
			//	resp.collection.items.forEach(item => imageList.push(item));
       
        setImageList(resp.collection.items);

        
       
			})
			.catch(err => {
				console.log(err);
			});

     
  };



  return (
    <ThemeProvider theme={crukTheme}>
      <SiteWrapper>
        <div>
          <h1>CRUK technical exercise - React</h1>
        </div>
        <div>
          <Formik
            validateOnChange
            initialValues={{
              keywords: "",
            }}
            validationSchema={formSchema}
            onSubmit={  (values) => {
              console.log(values);
              handleSubmit(values);
              console.log(imageList);
              
            }}>
            {({ errors, touched }) => {
              return (
                <Form>
                  <Field name="keywords">
                    {({ field }) => (
                      <>
                        <TextField
                          label="Keywords" 
                          type="text"
                          required
                          {...field}
                        />
                        {errors.keywords && touched.keywords && <p>{errors.keywords}</p>}
                      </>
                    )}
                  </Field>

                  <Field name="mediaType">
                    {({ field }) => (
                      <>
                        <Select
                      label="Media type"
                      {...field}
                      required
                    
                    >
                      <option value=""></option>
                      <option value="audio">Audio</option>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                       
                    </Select>
                      {errors.mediaType && touched.mediaType && <p>{errors.mediaType}</p>}
                      </>
                    )}
                  </Field>

                    <Field name="yearStart">
                    {({ field }) => (
                      <>
                        <TextField
                          label="Year start" 
                          type="number"
                          required
                          maxLength="4"
                          {...field}
                        />
                        {errors.yearStart && touched.yearStart && <p>{errors.yearStart}</p>}
                      </>
                    )}
                  </Field>

                  <Button type="submit">Submit</Button>
                </Form>
              )
            }}
          </Formik>
        </div>
        <div>
         
        
        <ol  >
       
        {  imageList.map(function (item, i) { 

            if(i>9){ return false }else{ 
               
             

                if( item.data[0].media_type === 'audio' ){
  

                  return (<li key={i} className="image-item">
                       {item.data[0].title}
                         

                    </li>) 
                }else{

                  return (<li key={i} className="image-item">
                       
                        <img alt='' src={item.links[0]['href']} />
                        <p>{item.data[0].title}</p>

                    </li>) 
                }
                 
            }
          })}
                

        </ol>

       

                     

            </div>
      </SiteWrapper>
    </ThemeProvider>
  );
}

export default App;
