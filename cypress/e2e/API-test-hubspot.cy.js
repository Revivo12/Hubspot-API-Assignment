// Test Plan - API Test for SAP Assignment - ROY REVIVO 

//  Suit's objective:
//  The primary goal of this test suite is to verify the creation, updating, and deletion of a contact within the HubSpot CRM using API requests.
//  Each test is designed to ensure that the CRM API handles contact data accurately, from the initial creation through updates to the final deletion.



describe('API test - SAP assignment', () => {

  let contactData
  const token = Cypress.env('HUB_BEARER_TOKEN');      // Token is set as an environment variable.
 
  beforeEach(() => {
    cy.fixture('./newContactDetails').then((details) => {      // Load the fixture data before each test into "contactData" variable.
      contactData = details; 
    });
  });


  it('Create a new contact', () => {
      cy.request({                        // Use POST request using "contactData" properties to create new contact.
        method: 'POST',
        url: '/crm/v3/objects/contacts',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          properties: {
            email: contactData.properties.email,
            firstname: contactData.properties.firstname,
            lastname: contactData.properties.lastname,
            phone: contactData.properties.phone,
            company: contactData.properties.company,
            website: contactData.properties.website,
            lifecyclestage: contactData.properties.lifecyclestage
          }
        }
      }).then((response) => {
          expect(response.status).to.eq(201);
      })

      // Wait 10 seconds for data to load in DB 
      cy.waitForDataToLoad(10)   

      // Email is unique for each contact, because of that, we know if email is found contact has created 
      cy.getContactDataByEmail(contactData.properties.email, token).then((data) => {  
        expect(data.properties.email).to.eq(contactData.properties.email)
      })
     
  })


  it('Update the contact details', () => {
    const newDetails = {        // New details to update our contact. 
      firstname:'Alexandra',
      phone:'0545552280',
      company:'SAP'
    }
      
    cy.request({                    // Use PATCH request to update contact details (firstname, phone and company).
      method: 'PATCH',
      url: `/crm/v3/objects/contacts/${contactData.properties.email}?idProperty=email`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        properties: {
          firstname: newDetails.firstname,
          phone: newDetails.phone,
          company: newDetails.company
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    })

    cy.getContactDataByEmail(contactData.properties.email, token).then((data) => {         // Get contact data by email using custom command -> Assert contact data is updated.
      expect(data.properties.firstname).to.eq(newDetails.firstname)
      expect(data.properties.phone).to.eq(newDetails.phone,)
      expect(data.properties.company).to.eq(newDetails.company)
    })

  })


  it('Delete the contact', () => {
    cy.getContactDataByEmail(contactData.properties.email, token).then((data => {       // Get contact data by email using custom command.
      const contactId = data.id

      cy.request({                   // Use DELETE request to delete contact by contact ID.         
        method: 'DELETE',
        url: `/crm/v3/objects/contacts/${contactId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {               // Validates new contact has been deleted.
        expect(response.status).to.eq(204);
      })  

    }))
  })

})

