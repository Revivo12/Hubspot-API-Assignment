///////////// SAP HOME ASSIGNMENT - ROY REVIVO /////////////
// This suit validates the following tests using API only:  
// - Creating new contact
// - Update new contact details
// - Delete new contact 


describe('API test - SAP assignment', () => {

  let contactData
  const token = 'pat-na1-3c7aa418-fe85-4c71-8754-608b92119efd'   // Bearer token
 
  beforeEach(() => {
    cy.fixture('./newContactDetails').then((details) => {      // Load the fixture data before each test
      contactData = details; 
    });
  });


  it('Create new contact', () => {
      cy.request({                  // Use POST request using contact details to create new contact
        method: 'POST',
        url: '/crm/v3/objects/contacts',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          "properties": {
            "email": contactData.properties.email,
            "firstname": contactData.properties.firstname,
            "lastname": contactData.properties.lastname,
            "phone": contactData.properties.phone,
            "company": contactData.properties.company,
            "website": contactData.properties.website,
            "lifecyclestage": contactData.properties.lifecyclestage
          }
        }
      }).then((response) => {
          expect(response.status).to.eq(201);
      })

      // DB takes around 10 seconds to add new contact, wait is needed, otherwise no contact data will be found
      cy.wait(10000)

      // Email is unique for each contact, because of that, we know if email is found contact has created 
      cy.getContactDataByEmail(contactData.properties.email, token).then((data) => {
        expect(data.properties.email).to.eq(contactData.properties.email)
      })

  })


  it('Update the new contact details', () => {
    cy.request({                    // Use PATCH request to update contact details (firstname, phone and company)
      method: 'PATCH',
      url: `/crm/v3/objects/contacts/${contactData.properties.email}?idProperty=email`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        "properties": {
          "firstname": "Alexandra",
          "phone": "0545552280",
          "company": "SAP"
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    })

    // Get contact data by email using custom command -> Assert contact data is updated
    cy.getContactDataByEmail(contactData.properties.email, token).then((data) => {
      expect(data.properties.firstname).to.eq('Alexandra')
      expect(data.properties.phone).to.eq('0545552280')
      expect(data.properties.company).to.eq('SAP')
    })
  })


  it('Delete the new contact', () => {
    cy.getContactDataByEmail(contactData.properties.email, token).then((data => {       // Get contact data by email using custom command
      const contactId = data.id
      cy.request({                // Use DELETE request to delete contact by contact ID            
        method: 'DELETE',
        url: `/crm/v3/objects/contacts/${contactId}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
      }).then((response) => {
        expect(response.status).to.eq(204);
      })  

    }))
  })

})

