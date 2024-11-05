// Test Plan - API Test for SAP Assignment - ROY REVIVO 

//  Suit's objective:
//  The primary goal of this test suite is to verify the creation, updating, and deletion of a contact within the HubSpot CRM using API requests.
//  Each test is designed to ensure that the CRM API handles contact data accurately, from the initial creation through updates to the final deletion.



describe('API test - SAP assignment', () => {

  let contactData
  const token = Cypress.env('HUB_BEARER_TOKEN');      // Token is set as an environment variable.
 
  before(() => {
    cy.fixture('./newContactDetails').then((details) => {      // Load the fixture data before each test into "contactData" variable.
      contactData = details; 
    });
  });


  it('Create a new contact', () => {
      // Use POST request using "contactData" properties to create new contact.
      const request= {
        method: 'POST',
        url: '/crm/v3/objects/contacts',
      }
      const payload = {
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

      cy.requestApi(request.method, request.url, token, payload).then((response) => {
          expect(response.status).to.eq(201);
      })

      // Wait 10 seconds for data to load in DB 
      cy.waitForDataToLoad(10)    
  })


  it('Update the contact details', () => {
    const newDetails = {        // New details to update our contact. 
      firstname:'Alexandra',
      phone:'0545552280',
      company:'SAP'
    }

    const request = {
      method: 'PATCH',
      url: `/crm/v3/objects/contacts/${contactData.properties.email}?idProperty=email`,
      
    }

    const payload = {
      properties: {
        firstname: newDetails.firstname,
        phone: newDetails.phone,
        company: newDetails.company
      }
    }


    // Use PATCH request to update contact details (firstname, phone and company).
    cy.requestApi(request.method, request.url, token, payload).then((response) => {
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

      const request = {
        method: 'DELETE',
        url: `/crm/v3/objects/contacts/${contactId}`,
      }

      // Use DELETE request to delete contact by contact ID.  
      cy.requestApi(request.method, request.url, token).then((response) => {               // Validates new contact has been deleted.
        expect(response.status).to.eq(204);
      }) 

    }))
  })

})

