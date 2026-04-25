import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultOptions = {
  create: [
    { optionLabel: 'Yes', optionValue: 'Yes', orderIndex: 1 },
    { optionLabel: 'No', optionValue: 'No', orderIndex: 2 },
    { optionLabel: 'N/A', optionValue: 'N/A', orderIndex: 3 },
  ]
};

async function main() {
  console.log('Clearing existing forms...');
  await prisma.form.deleteMany({});
  
  console.log('Seeding OHS Forms...');

  const disabilityForm = await prisma.form.create({
    data: {
      title: 'OHS CHECK LIST FOR DISABILITY VENUE',
      description: 'Complete occupational health and safety assessment for disability access.',
      version: '1.0',
      isActive: true,
      sections: {
        create: [
          {
            title: 'General Information',
            orderIndex: 0,
            questions: {
              create: [
                { label: 'Name of the premises', inputType: 'text', placeholder: 'Enter name', orderIndex: 1 },
                { label: 'Date of review', inputType: 'date', placeholder: 'Select Date', orderIndex: 2 },
                { label: 'Review conducted by', inputType: 'text', placeholder: 'Enter inspector name', orderIndex: 3 },
              ],
            },
          },
          {
            title: '1. Access to the building',
            orderIndex: 1,
            questions: {
              create: [
                { label: '1.1 Is there a ramp for person with disability to access the building?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '1.2 Is there a paraplegic door for person with disability to easily access the building?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '1.3 Is the passage/walkways wide enough to cater for any size of a wheelchair?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '1.4 Is the pathways clear of any obstacles?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '1.5 Are the doors and turning areas wide to cater for a wheelchair?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
              ]
            }
          },
          {
            title: '2. PARKING',
            orderIndex: 2,
            questions: {
              create: [
                { label: '2.1 Is there a designated parking bay for persons with disability?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '2.2 Is the disability parking located at an accessible area and clearly marked?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '2.3 Is the ground surface of the disability parking bay firm and level?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '2.4 Is the parking bay easily accessible without having to move behind parked vehicle?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '2.5 Does a pathway lead from the accessible parking to the facility entrance?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
              ]
            }
          },
          {
            title: '3. Floor and ground surface',
            orderIndex: 3,
            questions: {
              create: [
                { label: '3.1 Is the floor and ground surface stable, firm and slip resistant under wet and dry conditions?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '3.2 Is the floor and ground surface slip resistant under wet and dry conditions?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
              ]
            }
          },
          {
            title: '4. Pathways',
            orderIndex: 4,
            questions: {
              create: [
                { label: '4.1 Is the route to the main entrance clearly marked?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '4.2 Is the route free of any potential hazards such as bollards, litter bins, outward opening windows and doors?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '4.3 Does the pathway have a minimum of 1m and overhead clearance of 2m?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '4.4 Is the path of travel stable and firm underfoot?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '4.5 Is the route level or not too steep, and flat with no site to site cross-fall?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
              ]
            }
          },
          {
            title: '5. Pedestrian safety',
            orderIndex: 5,
            questions: {
              create: [
                { label: '5.1 Are the ramps installed where required?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '5.2 Is ramp and roadway level with no lip at the base?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '5.3 Does the ramp align with each other?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
              ]
            }
          },
          {
            title: '6. Doorways',
            orderIndex: 6,
            questions: {
              create: [
                { label: '6.1 Is there a level or step-free entry available?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '6.2 Are there wide, easy to open or automatic doors?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '6.3 Are the door handles level accessible height?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
              ]
            }
          },
          {
            title: '7. Passageways',
            orderIndex: 7,
            questions: {
              create: [
                { label: '7.1 Is the corridor free from obstruction to wheelchair users?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '7.2 Is the clear space between the furniture for a person to maneuver a mobility aid?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
              ]
            }
          },
          {
            title: '8. Safety signage',
            orderIndex: 8,
            questions: {
              create: [
                { label: '8.1 Is there any signage(symbols) that directs people into and through the building and are all relevant locations clearly signed?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '8.2 Is the lighting even and glare-free?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '8.3 Are the signages clear and easy to read and, can be read from both sitting and standing eye levels?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
              ]
            }
          },
          {
            title: '9. Venues or rooms',
            orderIndex: 9,
            questions: {
              create: [
                { label: '9.1 In any meeting or eating space tables, chairs and the layout have adequate leg clearance for a person using a wheelchair?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '9.2 Is there a hearing induction loop or amplifying device fitted in meeting rooms?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
              ]
            }
          },
          {
            title: '10. Toilets',
            orderIndex: 10,
            questions: {
              create: [
                { label: '10.1 Is there a toilet designated for persons with disability?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '10.2 Is the handle located at the right position? (knobs are not user friendly; taps are not user friendly. The basins are too high.)', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '10.3 Is sanitizer/wipes/soap and hand drying equipment in easy reach of user at the basin or for a setting on wheelchair person?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '10.4 Is there a hand basin available and it is deep enough and high enough for a person using a wheelchair to use?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '10.5 Is the cleaning roster or check list available?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: '10.6 Is there a designated ablution facility for persons with disability?', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
                { label: '10.7 Is the location of the ablution facility clearly marked?', inputType: 'radio_with_comments', orderIndex: 7, options: defaultOptions },
                { label: '10.8 Are access route to the ablution facility kept clear of any obstructions?', inputType: 'radio_with_comments', orderIndex: 8, options: defaultOptions },
                { label: '10.9 Is the ablution facility big enough for a person using a wheelchair and a sufficient space to move within the facility?', inputType: 'radio_with_comments', orderIndex: 9, options: defaultOptions },
                { label: '10.10 Are the door fittings/locks and light switches easily reached and operated from both standing and sitting heights?', inputType: 'radio_with_comments', orderIndex: 10, options: defaultOptions },
                { label: '10.11 Are the grab rails on the back and side walls of the accessible toilets and are they colour contrast from the background?', inputType: 'radio_with_comments', orderIndex: 11, options: defaultOptions },
                { label: '10.12 Does the toilet seat contrast from the toilet pan and the room?', inputType: 'radio_with_comments', orderIndex: 12, options: defaultOptions },
                { label: '10.13 Is the toilet paper holder within easy reach of a person sitting on the pan?', inputType: 'radio_with_comments', orderIndex: 13, options: defaultOptions },
              ]
            }
          },
          {
            title: '11. Evacuation',
            orderIndex: 11,
            questions: {
              create: [
                { label: '11.1 Are there visible and audible fire alarms?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '11.2 Does signage direct you to the emergency exit?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '11.3 Are there accessible emergency exits?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '11.4 Is there any evacuation strategy (emergency plan) in place to meet the needs of people with a disability in the event of an emergency?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '11.5 Does an accessible pathway lead you away from the building to the emergency assembly point?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
              ]
            }
          },
          {
            title: '12. Pedestrian crossing?',
            orderIndex: 12,
            questions: {
              create: [
                { label: '12.1 Is there any pedestrian crossing with signages (where necessary)?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '12.2 Is there an audio signal available at the crossing?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
              ]
            }
          },
          {
            title: '13. Lift',
            orderIndex: 13,
            questions: {
              create: [
                { label: '13.1 Is there a lift fitted with an audio for hearing impaired user?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '13.2 Is there a light flickering as an indicator for a hearing-impaired user?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
              ]
            }
          },
          {
            title: 'Final Remarks',
            orderIndex: 14,
            questions: {
              create: [
                { label: 'Comments and suggestions', inputType: 'text', placeholder: 'Enter any overall comments or suggestions...', orderIndex: 1 }
              ]
            }
          }
        ],
      },
    },
  });

  console.log(`Created Form: ${disabilityForm.title}`);

  const ohsAuditForm = await prisma.form.create({
    data: {
      title: 'OCCUPATIONAL HEALTH & SAFETY AUDIT CHECKLIST',
      description: 'Audit checklist for occupational health and safety compliance.',
      version: '1.0',
      isActive: true,
      sections: {
        create: [
          {
            title: 'General Information',
            orderIndex: 0,
            questions: {
              create: [
                { label: 'NAME OF THE BUILDING', inputType: 'text', placeholder: 'Enter name', orderIndex: 1 },
                { label: 'DATE OF INSPECTION', inputType: 'date', placeholder: 'Select Date', orderIndex: 2 },
              ],
            },
          },
          {
            title: '1. OHSA ORGANISATIONAL MANAGEMENT',
            orderIndex: 1,
            questions: {
              create: [
                { label: '1.1 Is there a copy of the OHS Act prominently displayed in a visible area? section 7', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '1.2 Is there an approved OHS Policy? Section 7', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '1.3 Is there an OHS Policy Statement displayed in a visible area? Section 7', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '1.4 Are there statutory appointments available and signed by the 16.1? Section 16 - Section 16.2 - Section 17.1 - Section 19.1 - GAR 9(2) - Evacuation Marshal - GSR3.4 First Aider - GSR4 Fire Fighter', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '1.5 Did the statutory appointees attended any Liability Training Course? Section 8', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: '1.6 Did the appointed OHS members subjected to a formal training on OHS, Basic fire-fighting, evacuation procedures and first aid? Section 8', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
                { label: '1.7 Are there any terms of reference (ToR) for OHS Committee?', inputType: 'radio_with_comments', orderIndex: 7, options: defaultOptions },
                { label: '1.8 Are all symbolic signs displayed on site?', inputType: 'radio_with_comments', orderIndex: 8, options: defaultOptions },
              ]
            }
          },
          {
            title: '2. GENERAL SAFETY REGULATIONS',
            orderIndex: 2,
            questions: {
              create: [
                { label: '2.1 Is there storage of flammable liquids if used on site? GSR', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '2.2 Is there work in confine spaces? GSR', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '2.3 Is there work at elevated platforms? GSR', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '2.4 Is there PPE procedure? GSR', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '2.5 Is there a register to control the issuing of PPE? GSR', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: '2.6 Is there an SOP on good stacking and storage practices? GSR', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
                { label: '2.7 Is the work-station design as per Building Regulation? GSR', inputType: 'radio_with_comments', orderIndex: 7, options: defaultOptions },
                { label: '2.8 Is there a provision of first box (es) at the workplace and accessible when a need arises? GSR', inputType: 'radio_with_comments', orderIndex: 8, options: defaultOptions },
                { label: '2.9 Is there a notice or sign in a conspicuous area at the workplace indicating the location of a first aid box(es) GSR', inputType: 'radio_with_comments', orderIndex: 9, options: defaultOptions },
                { label: '2.10 Is the first aid box(es) filled with the minimum contents as required by the GSR for office environment? GSR', inputType: 'radio_with_comments', orderIndex: 10, options: defaultOptions },
                { label: '2.11 Are there any procedures developed to assist in a case of injury on duty? GSR', inputType: 'radio_with_comments', orderIndex: 11, options: defaultOptions },
                { label: '2.12 Is the workplace provided with a ramp (to cater for people with disabilities) that is constructed in accordance with acceptable standards?', inputType: 'radio_with_comments', orderIndex: 12, options: defaultOptions },
              ]
            }
          },
          {
            title: '3. GENERAL ADMINISTRATION REGULATIONS',
            orderIndex: 3,
            questions: {
              create: [
                { label: '3.1 Are all incidents recorded and reported using WCL2 or Annexure 2? Near-miss, Injuries/First aid, Medical, Fatalities', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '3.2 Is there an incident register for any incident that may occur e in the workplace? GSR', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '3.3 investigations done by the competent person? GSR', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
              ]
            }
          },
          {
            title: '4. REGULATION for HAZARDOUS BIOLOGICAL AGENTS',
            orderIndex: 4,
            questions: {
              create: [
                { label: '4.1 Are there HBA being processed on site?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '4.2 Is there a provision of personal protective equipment to officials exposed to HBA?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '4.3 Is training provided to people who might be exposed to HBA?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '4.4 Is there a risk assessment conducted?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '4.5 Is there a Departmental Medical Surveillance Policy? (Included in OHS Policy).', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: '4.6 Are officials working in an environment where they might be exposed to HBA subjected to pre-employment, periodic and post medical surveillance?', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
              ]
            }
          },
          {
            title: '5. ENVIRONMENTAL REGULATIONS FOR WORKPLACES',
            orderIndex: 5,
            questions: {
              create: [
                { label: '5.1 Is the workplace illuminated (lighting) in accordance with the illuminance value? ERW', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '5.2 Are there precautionary measures in place for means of egress? ERW', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '5.3 Is the emergency escape door opening outward? ERW', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '5.4 Are staircases provided with a safe handrail? ERW', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '5.5 Is the workplace well ventilated either by natural or mechanical means? ERW', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: '5.6 Is the indoor workplace (floors, stairs, passages and gangways) kept clean and state of repairs, skid-free and free from any obstruction. ERW', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
                { label: '5.7 Is there an Emergency / Evacuation plan in the workplace. ERW', inputType: 'radio_with_comments', orderIndex: 7, options: defaultOptions },
                { label: '5.8 Is there an Emergency Preparedness Team appointed in your department? Fire fighters, First Aiders, Evacuation Marshall, Communication leader', inputType: 'radio_with_comments', orderIndex: 8, options: defaultOptions },
                { label: '5.9 Is there emergency evacuation preparedness drill conducted (once or twice a year)?', inputType: 'radio_with_comments', orderIndex: 9, options: defaultOptions },
                { label: '5.10 Is housekeeping maintained in accordance with the Regulation? ERW', inputType: 'radio_with_comments', orderIndex: 10, options: defaultOptions },
                { label: '5.11 Is there a waste management plan?', inputType: 'radio_with_comments', orderIndex: 11, options: defaultOptions },
              ]
            }
          },
          {
            title: '6. REGULATIONS FOR HAZARDOUS CHEMICAL SUBSTANCES',
            orderIndex: 6,
            questions: {
              create: [
                { label: '6.1 Is there a procedure on chemical handling and transportation? Chemicals should be SABS approved.', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '6.2 Is there storage for hazardous chemicals substances?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '6.3 Is the Material safety Data Sheet (MSDS) displayed for all hazardous chemicals substances?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
              ]
            }
          },
          {
            title: '7. ELECTRICAL INSTALLATION REGULATIONS',
            orderIndex: 7,
            questions: {
              create: [
                { label: '7.1 Is there a valid Certificate of Compliance on site for the building', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '7.2 Is all Electrical Equipment inspected and maintained by a competent person', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '7.3 Is labelling done according to the regulations?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '7.4 Are all electrical wires insulated and proper plugs used in your workplace?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
              ]
            }
          },
          {
            title: '8. PRESSURE EQUIPMENT REGULATIONS',
            orderIndex: 8,
            questions: {
              create: [
                { label: '8.1 Is there a provision of fire extinguishers, fire hose reels onsite?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '8.2 Are these equipment serviced/ maintained/tested in accordance with the Regulations?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
              ]
            }
          },
          {
            title: '9. ELECTRICAL INSTALLATION REGULATIONS (Cont.)',
            orderIndex: 9,
            questions: {
              create: [
                { label: '9.1 Is there an Approved Inspection Authority (AIA) to inspect, test or investigate for any installed electricity?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '9.2 Is there a valid Certificate of Compliance for the installation of electricity?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '9.3 Are there any fire safety precautionary measures for any electrical installations?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
              ]
            }
          },
          {
            title: '10. LIFT, ESCALATOR AND PASSENGER CONVEYOR REGULATIONS',
            orderIndex: 10,
            questions: {
              create: [
                { label: '10.1 Is the lift/escalator inspected and tested in accordance it the relevant health & safety standards ion and test done according to regulation? LEPCR', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '10.2 Is maintenance done as per the Regulation? LEPCR', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '10.3 Are records of any maintenance/tests available on site? LEPCR', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
              ]
            }
          },
          {
            title: '11. FACILITIES REGULATIONS',
            orderIndex: 11,
            questions: {
              create: [
                { label: '11.1 Sanitation - Is there a provision of ablution facilities with a conspicuous sign outside the entrance to indicate the gender of the user? FR', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '11.1 Sanitation - Is there a provision of an ablution facility for cater for persons with disabilities? FR', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '11.1 Sanitation - Are these facilities regularly cleaned? FR', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '11.1 Sanitation - Are hand drying facilities always available e.g. paper towels? FR', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '11.1 Sanitation - Is there running water? FR', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: '11.1 Sanitation - Is there provision of soap? FR', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
                { label: '11.1 Sanitation - Is there a waste and sanitary bins available? FR', inputType: 'radio_with_comments', orderIndex: 7, options: defaultOptions },
                { label: '11.2 Is there a designated smoking area that is well ventilated? FR', inputType: 'radio_with_comments', orderIndex: 8, options: defaultOptions },
                { label: '11.3 Is there provision of an ergonomically sound seat for every employees whose work should be performed while sitting down? FR', inputType: 'radio_with_comments', orderIndex: 9, options: defaultOptions },
                { label: '11.4 Is there an occupancy certificate for the building to ensure that it complies with the facilities regulation? FR', inputType: 'radio_with_comments', orderIndex: 10, options: defaultOptions },
                { label: '11.5 Is the premises accessible for persons with disabilities?', inputType: 'radio_with_comments', orderIndex: 11, options: defaultOptions },
                { label: '11.6 Is there a demarcated parking for people with disabilities?', inputType: 'radio_with_comments', orderIndex: 12, options: defaultOptions },
                { label: '11.7 Are evacuation chairs provided for in case of an emergency that warrant an evacuation?', inputType: 'radio_with_comments', orderIndex: 13, options: defaultOptions },
              ]
            }
          },
          {
            title: 'Signatures',
            orderIndex: 12,
            questions: {
              create: [
                { label: 'OHS OFFICIAL NAME', inputType: 'text', placeholder: 'Enter name', orderIndex: 1 },
                { label: 'OHS OFFICIAL DESIGNATION', inputType: 'text', placeholder: 'Enter designation', orderIndex: 2 },
                { label: 'OHS OFFICIAL DATE', inputType: 'date', orderIndex: 3 },
                { label: '16.2 APPOINTEE NAME', inputType: 'text', placeholder: 'Enter name', orderIndex: 4 },
                { label: '16.2 APPOINTEE DESIGNATION', inputType: 'text', placeholder: 'Enter designation', orderIndex: 5 },
                { label: '16.2 APPOINTEE DATE', inputType: 'date', orderIndex: 6 },
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`Created Form: ${ohsAuditForm.title}`);

  const newBuildingForm = await prisma.form.create({
    data: {
      title: 'PRE-OCCUPATION BUILDING ASSESSMENT CHECKLIST',
      description: 'Check pre-occupation / building safety assessment.',
      version: '1.0',
      isActive: true,
      sections: {
        create: [
          {
            title: 'General Information',
            orderIndex: 0,
            questions: {
              create: [
                { label: 'Name of the Building', inputType: 'text', placeholder: 'Enter name of the building', orderIndex: 1 },
                { label: 'Address', inputType: 'text', placeholder: 'Enter address', orderIndex: 2 },
                { label: 'Date of Inspection', inputType: 'date', placeholder: 'Select Date', orderIndex: 3 },
                { label: 'Construction Type', inputType: 'text', placeholder: 'Enter construction type', orderIndex: 4 },
                { label: 'Description', inputType: 'text', placeholder: 'Enter description', orderIndex: 5 },
              ]
            }
          },
          {
            title: '1. Occupancy Classification',
            orderIndex: 1,
            questions: {
              create: [
                { label: '1.1 Specific use?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '1.2 Number of stories?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '1.3 Walls and floors in good order?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '1.4 Area in sq. ft. per floor proposed for use?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '1.5 Mixed occupancy?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: '1.6 Construction separation?', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
              ]
            }
          },
          {
            title: '2. Structure',
            orderIndex: 2,
            questions: {
              create: [
                { label: '2.1 Walls and floors in good order?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
              ]
            }
          },
          {
            title: '3A. Fire Protection - Fire Alarm System',
            orderIndex: 3,
            questions: {
              create: [
                { label: 'A.1 Fire alarm system available? Manual/ Automatic and functionality', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: 'A.2 Heat detectors?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: 'A.3 Smoke detectors?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: 'A.4 Testing intervals?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: 'A.5 Date of last service?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: 'A.6 Service/ maintenance provider?', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
                { label: 'A.7 Communication (PA) system present and audible in all floors?', inputType: 'radio_with_comments', orderIndex: 7, options: defaultOptions },
              ]
            }
          },
          {
            title: '3B. Fire Protection - Fire Extinguishers',
            orderIndex: 4,
            questions: {
              create: [
                { label: 'B.1 Fire extinguishers present and readily accessible?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: 'B.2 Inspected/ tested monthly and serviced annually?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: 'B.3 Service/ maintenance provider?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
              ]
            }
          },
          {
            title: '3C. Fire Protection - Sprinklers',
            orderIndex: 5,
            questions: {
              create: [
                { label: 'C.1 Sprinklers present?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: 'C.2 Date of last inspection/ test?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: 'C.3 Maintenance provider?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: 'C.4 Sprinkler system plate present?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
              ]
            }
          },
          {
            title: '3D. Fire Protection - Hoses and Fire Hydrants',
            orderIndex: 6,
            questions: {
              create: [
                { label: 'D.1 Date of last inspection/ test?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: 'D.2 Maintenance provider?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
              ]
            }
          },
          {
            title: '4. Electrical Installations and Lighting',
            orderIndex: 7,
            questions: {
              create: [
                { label: '4.1 Is all Electrical installations inspected and maintained by a competent person (AIA)? EIR2', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '4.2 Are all electrical wires insulated?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '4.3 Are the distribution boards properly marked/ labelled and secured?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '4.4 Is there a provision of a generator that is placed in an approved location?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '4.5 Are there sufficient emergency lights in the building?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
              ]
            }
          },
          {
            title: '5. Emergency Exits and Means of Egress',
            orderIndex: 8,
            questions: {
              create: [
                { label: '5.1 Are there precautionary measures in place for means of egress? ERW9', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '5.2 Emergency escape door/s opening outward? ERW9', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '5.3 Emergency / Evacuation plan available. ERW9', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '5.4 Approved floor plans of the building available?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '5.5 Are all designated fire/emergency escape routes clear of any obstructions?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: '5.6 Are emergency contact details displayed in visible areas?', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
                { label: '5.7 Exits doors clear of hazards (combustible materials, flammable liquids etc.)?', inputType: 'radio_with_comments', orderIndex: 7, options: defaultOptions },
                { label: '5.8 Exit illumination present?', inputType: 'radio_with_comments', orderIndex: 8, options: defaultOptions },
                { label: '5.9 Number of emergency exit doors?', inputType: 'radio_with_comments', orderIndex: 9, options: defaultOptions },
              ]
            }
          },
          {
            title: '6. Lifts and Escalators',
            orderIndex: 9,
            questions: {
              create: [
                { label: '6.1 Fireman’s lift available and properly marked?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '6.2 Name and telephone number of the competent lift service provider affixed on the lift/s?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '6.3 Are all the lift/s regularly inspected and tested in accordance with the Act/Regulations?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '6.4 Are the lift/s examined by a competent lift service provider?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '6.5 Are there any maintenance records kept in the lift compartment (for 10 years)?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
              ]
            }
          },
          {
            title: '7. Ventilation',
            orderIndex: 10,
            questions: {
              create: [
                { label: '7.1 Ventilation system mechanical/ natural?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
              ]
            }
          },
          {
            title: '8. Ablution Facilities',
            orderIndex: 11,
            questions: {
              create: [
                { label: '8.1 Number of ablution facilities?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '8.2 Are all the toilets in a working order? (No leaks and/ or defects).', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
              ]
            }
          },
          {
            title: '9. Compliance Documents',
            orderIndex: 12,
            questions: {
              create: [
                { label: '9.1 Occupancy Certificate available?', inputType: 'radio_with_comments', orderIndex: 1, options: defaultOptions },
                { label: '9.2 Municipal approved building plans?', inputType: 'radio_with_comments', orderIndex: 2, options: defaultOptions },
                { label: '9.3 Relevant documentation from town planning (i.e. rezoning, building line relaxation, consent) and if necessary, an approved Site Development Plan (SDP)?', inputType: 'radio_with_comments', orderIndex: 3, options: defaultOptions },
                { label: '9.4 Engineering completion certificate, signed by a registered structural/ civil engineer?', inputType: 'radio_with_comments', orderIndex: 4, options: defaultOptions },
                { label: '9.5 Roof truss certificate issued by a competent person or structural engineer?', inputType: 'radio_with_comments', orderIndex: 5, options: defaultOptions },
                { label: '9.6 Plumbing certificate issued by a registered plumber?', inputType: 'radio_with_comments', orderIndex: 6, options: defaultOptions },
                { label: '9.7 Glazing certificate issued by a glazing installer?', inputType: 'radio_with_comments', orderIndex: 7, options: defaultOptions },
                { label: '9.8 Electrical certificate issued by a registered electrician?', inputType: 'radio_with_comments', orderIndex: 8, options: defaultOptions },
                { label: '9.9 Fire certificate?', inputType: 'radio_with_comments', orderIndex: 9, options: defaultOptions },
                { label: '9.10 Gas certificate issued by a registered gas installer?', inputType: 'radio_with_comments', orderIndex: 10, options: defaultOptions },
                { label: '9.11 Architectural certificate issued by the appointed registered person?', inputType: 'radio_with_comments', orderIndex: 11, options: defaultOptions },
              ]
            }
          },
          {
            title: 'General Remarks & Approval',
            orderIndex: 13,
            questions: {
              create: [
                { label: 'General Remarks', inputType: 'text', placeholder: 'Enter remarks', orderIndex: 1 },
                { label: 'OHS OFFICIAL NAME', inputType: 'text', placeholder: 'Enter name', orderIndex: 2 },
                { label: 'OHS OFFICIAL DESIGNATION', inputType: 'text', placeholder: 'Enter designation', orderIndex: 3 },
                { label: 'OHS OFFICIAL DATE', inputType: 'date', orderIndex: 4 },
                { label: 'APPROVAL NAME', inputType: 'text', placeholder: 'Enter name', orderIndex: 5 },
                { label: 'APPROVAL DESIGNATION', inputType: 'text', placeholder: 'Enter designation', orderIndex: 6 },
                { label: 'APPROVAL DATE', inputType: 'date', orderIndex: 7 },
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`Created Form: ${newBuildingForm.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
