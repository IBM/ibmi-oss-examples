         ctl-opt main(main) dftactgrp(*no);                                                                             
      //------------------------------------------------------------------//                                            
      //                                                                  //                                            
      // Send JSON data to DataQueue for sending SMS with TWILIO          //                                            
      //                                                                  //                                            
      //-----------------                                                 //                                            
      // R.Ross 12.2018 *                                                 //                                            
      //------------------------------------------------------------------//                                            
      // SQL-Options                                                      //                                            
      //------------------------------------------------------------------//                                            
                                                                                                                        
         exec sql set option datfmt=*iso, timfmt=*iso, commit=*none,                                                    
                             decmpt=*period, closqlcsr=*endactgrp;                                                      
                                                                                                                        
      //------------------------------------------------------------------//                                            
      // Send Data to DTAQ                                                //                                            
      //------------------------------------------------------------------//                                            
                                                                                                                        
         dcl-pr sndDtaq      extpgm('QSNDDTAQ');                                                                        
                 DtqName     like(DtqName)   const;                                                                     
                 DtqLib      like(DtqLib)    const;                                                                     
                 DtqLength   like(DtqLength) const;                                                                     
                 DtqData     char(32766)     const options(*varsize);                                                   
         end-pr;                                                                                                        
                                                                                                                        
      //------------------------------------------------------------------//                                            
      // Variables DTQ-API                                                //                                            
      //------------------------------------------------------------------//                                            
                                                                                                                        
         dcl-s   DtqName   char(10)   inz('SNDSMSQ');      // DTQ-Name                                                  
         dcl-s   DtqLib    char(10)   inz('MYLIB');        // DTQ-Lib                                                   
         dcl-s   DtqLength packed(05) inz(%size(DtqData)); // DTQ-Length                                                
         dcl-s   DtqWait   packed(05) inz(-1);             // DTQ-Wait                                                  
         dcl-s   DtqData   char(5000);                     // DTQ-Data                                                  
                                                                                                                        
      //------------------------------------------------------------------//                                            
      // Datastructure SMS                                                //                                            
      //------------------------------------------------------------------//                                            
                                                                                                                        
         dcl-ds  DsSMS       qualified inz;                                                                             
                  to         varchar(30);             // SMS-to                                                         
                  from       varchar(30);             // SMS-from                                                       
                  body       varchar(4000);           // SMS-body                                                       
         end-ds;                                                                                                        
                                                                                                                        
      //------------------------------------------------------------------//                                            
      // Main                                                             //                                            
      //------------------------------------------------------------------//                                            
         dcl-proc main;                                                                                                 
                                                                                                                        
         dcl-s   index       uns(10);                 // Index                                                          
                                                                                                                        
           for index = 1 to 5;                        // 5 SMS in a loop                                                
             DsSMS.to   = '+123456789';               // SMS-to                                                         
             DsSMS.from = '+678901234';               // SMS-from                                                       
             DsSMS.body = 'Hello from Node ' + %char(index);                                                            
                                                                                                                        
             DtqData = crtJson(DsSMS);                // create JSON data                                               
                                                                                                                        
             snddtaq(DtqName:DtqLib:DtqLength:DtqData); // Send to DTQ                                                  
           endfor;                                                                                                      
                                                                                                                        
           DsSMS.body = '*end';                                                                                         
           snddtaq(DtqName:DtqLib:DtqLength:DtqData);   // Send to DTQ                                                  
                                                                                                                        
         end-proc;                                                                                                      
      //------------------------------------------------------------------//                                            
      // create JSON data                                                 //                                            
      // {"body":"Hello", "to":"+123456789", "from":"+123456789"}         //                                            
      //------------------------------------------------------------------//                                            
         dcl-proc crtJson;                                                                                              
         dcl-pi *n           like(LocData);                                                                             
                 PiSMS       likeds(DsSMS) const;                                                                       
         end-pi;                                                                                                        
                                                                                                                        
         dcl-s   LocData     varchar(5000);           // JSON-Data                                                      
                                                                                                                        
           exec sql                                                                                                     
            set :LocData = JSON_OBJECT(                                                                                 
               'body'    value trim(:PiSMS.body),                                                                       
               'to'      value trim(:PiSMS.to),                                                                         
               'from'    value trim(:PiSMS.from)                                                                        
           );                                                                                                           
                                                                                                                        
           return LocData;                                                                                              
                                                                                                                        
         end-proc;                                                                                                      
      //------------------------------------------------------------------//                                             
