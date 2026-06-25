/**
 * seed-forms.ts
 * Seeds the OHS forms using the two-layer versioning model:
 *   Form → FormVersion (published) → FormSection → QuestionInput → QuestionOption
 */

import { PrismaClient, InputType, FormVersionStatus } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

type OptionSeed = { optionLabel: string; optionValue: string };
type QuestionSeed = {
  label: string;
  inputType: InputType;
  placeholder?: string;
  isRequired?: boolean;
  options?: OptionSeed[];
};
type SectionSeed = { title: string; questions: QuestionSeed[] };
type FormSeed = { slug: string; title: string; description: string; sections: SectionSeed[] };

const yesNoNa: OptionSeed[] = [
  { optionLabel: 'Yes', optionValue: 'Yes' },
  { optionLabel: 'No', optionValue: 'No' },
  { optionLabel: 'N/A', optionValue: 'NA' },
];

const radioQ = (label: string): QuestionSeed => ({
  label,
  inputType: InputType.RADIO,
  options: yesNoNa,
});

const textQ = (label: string, placeholder?: string): QuestionSeed => ({
  label,
  inputType: InputType.TEXT,
  placeholder,
});

const dateQ = (label: string): QuestionSeed => ({
  label,
  inputType: InputType.DATE,
});

// ─── Form seed data ───────────────────────────────────────────────────────────

const forms: FormSeed[] = [
  // ── 1. Disability Assessment ─────────────────────────────────────────────
  {
    slug: 'ohs-disability-assessment',
    title: 'OHS CHECK LIST FOR DISABILITY VENUE',
    description: 'Complete occupational health and safety assessment for disability access.',
    sections: [
      {
        title: 'General Information',
        questions: [
          textQ('Name of the premises', 'Enter name'),
          dateQ('Date of review'),
          textQ('Review conducted by', 'Enter inspector name'),
        ],
      },
      {
        title: '1. Access to the building',
        questions: [
          radioQ('1.1 Is there a ramp for person with disability to access the building?'),
          radioQ('1.2 Is there a paraplegic door for person with disability to easily access the building?'),
          radioQ('1.3 Is the passage/walkways wide enough to cater for any size of a wheelchair?'),
          radioQ('1.4 Is the pathways clear of any obstacles?'),
          radioQ('1.5 Are the doors and turning areas wide to cater for a wheelchair?'),
        ],
      },
      {
        title: '2. PARKING',
        questions: [
          radioQ('2.1 Is there a designated parking bay for persons with disability?'),
          radioQ('2.2 Is the disability parking located at an accessible area and clearly marked?'),
          radioQ('2.3 Is the ground surface of the disability parking bay firm and level?'),
          radioQ('2.4 Is the parking bay easily accessible without having to move behind parked vehicle?'),
          radioQ('2.5 Does a pathway lead from the accessible parking to the facility entrance?'),
        ],
      },
      {
        title: '3. Floor and ground surface',
        questions: [
          radioQ('3.1 Is the floor and ground surface stable, firm and slip resistant under wet and dry conditions?'),
          radioQ('3.2 Is the floor and ground surface slip resistant under wet and dry conditions?'),
        ],
      },
      {
        title: '4. Pathways',
        questions: [
          radioQ('4.1 Is the route to the main entrance clearly marked?'),
          radioQ('4.2 Is the route free of any potential hazards such as bollards, litter bins, outward opening windows and doors?'),
          radioQ('4.3 Does the pathway have a minimum of 1m and overhead clearance of 2m?'),
          radioQ('4.4 Is the path of travel stable and firm underfoot?'),
          radioQ('4.5 Is the route level or not too steep, and flat with no site to site cross-fall?'),
        ],
      },
      {
        title: '5. Pedestrian safety',
        questions: [
          radioQ('5.1 Are the ramps installed where required?'),
          radioQ('5.2 Is ramp and roadway level with no lip at the base?'),
          radioQ('5.3 Does the ramp align with each other?'),
        ],
      },
      {
        title: '6. Doorways',
        questions: [
          radioQ('6.1 Is there a level or step-free entry available?'),
          radioQ('6.2 Are there wide, easy to open or automatic doors?'),
          radioQ('6.3 Are the door handles level accessible height?'),
        ],
      },
      {
        title: '7. Passageways',
        questions: [
          radioQ('7.1 Is the corridor free from obstruction to wheelchair users?'),
          radioQ('7.2 Is the clear space between the furniture for a person to maneuver a mobility aid?'),
        ],
      },
      {
        title: '8. Safety signage',
        questions: [
          radioQ('8.1 Is there any signage that directs people into and through the building?'),
          radioQ('8.2 Is the lighting even and glare-free?'),
          radioQ('8.3 Are the signages clear and easy to read from both sitting and standing eye levels?'),
        ],
      },
      {
        title: '9. Venues or rooms',
        questions: [
          radioQ('9.1 In meeting/eating spaces do tables and chairs have adequate leg clearance for a wheelchair?'),
          radioQ('9.2 Is there a hearing induction loop or amplifying device fitted in meeting rooms?'),
        ],
      },
      {
        title: '10. Toilets',
        questions: [
          radioQ('10.1 Is there a toilet designated for persons with disability?'),
          radioQ('10.2 Is the handle located at the right position?'),
          radioQ('10.3 Is sanitizer/wipes/soap and hand drying equipment in easy reach?'),
          radioQ('10.4 Is there a hand basin available and high enough for a person using a wheelchair?'),
          radioQ('10.5 Is the cleaning roster or check list available?'),
          radioQ('10.6 Is there a designated ablution facility for persons with disability?'),
          radioQ('10.7 Is the location of the ablution facility clearly marked?'),
          radioQ('10.8 Are access routes to the ablution facility kept clear of obstructions?'),
          radioQ('10.9 Is the ablution facility big enough for a person using a wheelchair?'),
          radioQ('10.10 Are door fittings/locks and light switches easily reached from both standing and sitting heights?'),
          radioQ('10.11 Are the grab rails on the back and side walls of the accessible toilets colour contrast from the background?'),
          radioQ('10.12 Does the toilet seat contrast from the toilet pan and the room?'),
          radioQ('10.13 Is the toilet paper holder within easy reach of a person sitting on the pan?'),
        ],
      },
      {
        title: '11. Evacuation',
        questions: [
          radioQ('11.1 Are there visible and audible fire alarms?'),
          radioQ('11.2 Does signage direct you to the emergency exit?'),
          radioQ('11.3 Are there accessible emergency exits?'),
          radioQ('11.4 Is there any evacuation strategy in place to meet the needs of people with a disability?'),
          radioQ('11.5 Does an accessible pathway lead you away from the building to the emergency assembly point?'),
        ],
      },
      {
        title: '12. Pedestrian crossing',
        questions: [
          radioQ('12.1 Is there any pedestrian crossing with signages (where necessary)?'),
          radioQ('12.2 Is there an audio signal available at the crossing?'),
        ],
      },
      {
        title: '13. Lift',
        questions: [
          radioQ('13.1 Is there a lift fitted with an audio for hearing impaired user?'),
          radioQ('13.2 Is there a light flickering as an indicator for a hearing-impaired user?'),
        ],
      },
      {
        title: 'Final Remarks',
        questions: [
          { label: 'Comments and suggestions', inputType: InputType.TEXTAREA, placeholder: 'Enter any overall comments or suggestions...' },
        ],
      },
    ],
  },

  // ── 2. OHS Compliance Audit Checklist ─────────────────────────────────────
  {
    slug: 'ohs-audit-checklist',
    title: 'OHS COMPLIANCE AUDIT CHECKLIST',
    description: 'Evaluate organizational compliance with OHS regulations.',
    sections: [
      {
        title: '1. HEALTH AND SAFETY POLICY',
        questions: [
          radioQ('Is there a Health and Safety Policy?'),
        ],
      },
      {
        title: '2. APPOINTMENT LETTERS',
        questions: [
          radioQ('Records kept and regularly updated?'),
          radioQ('2.1 Appointment Letter 1'),
          radioQ('2.2 Appointment Letter 2'),
          radioQ('2.3 Appointment Letter 3'),
        ],
      },
      {
        title: '3. OHS COMMITTEE MEETINGS',
        questions: [
          radioQ('Records kept and regularly updated?'),
          radioQ('3.1 Minutes of the meeting'),
          radioQ('3.2 Schedule for meetings'),
          radioQ('3.3 Other meeting records'),
        ],
      },
      {
        title: '4. TRAINING',
        questions: [
          radioQ('OHS Structures?'),
          radioQ('4.1 Training Item 1'),
          radioQ('4.2 Training Item 2'),
          radioQ('4.3 Training Item 3'),
          radioQ('4.4 Training Item 4'),
        ],
      },
      {
        title: '6. RISK ASSESSMENTS',
        questions: [
          radioQ('Risk register for the province?'),
          radioQ('6.1 Risk Assessment 1'),
          radioQ('6.2 Risk Assessment 2'),
        ],
      },
      {
        title: '7. INCIDENTS MANAGEMENT',
        questions: [
          radioQ('Incident register for the province?'),
          radioQ('7.1 Reported incidents investigated?'),
          radioQ('7.2 Incidents recorded?'),
        ],
      },
      {
        title: '8. AWARENESS AND INDUCTIONS',
        questions: [
          radioQ('Awareness register?'),
          radioQ('8.1 Awareness Item 1'),
          radioQ('8.2 Awareness Item 2'),
        ],
      },
      {
        title: '9. HAZARDOUS CHEMICALS AND BIOLOGICAL SUBSTANCES',
        questions: [
          radioQ('Safety Data Sheets?'),
          radioQ('9.1 Chemical/Biological Item 1'),
        ],
      },
      {
        title: '10. STRUCTURES / BUILDINGS',
        questions: [
          radioQ('Compliance certificates for structures?'),
          radioQ('10.1 Certificate of occupancy?'),
          radioQ('10.2 COC?'),
          radioQ('10.3 Emergency evacuation plan?'),
          radioQ('10.4 Floor plans?'),
          radioQ('10.5 Backup generator?'),
          radioQ('10.6 Backup water system?'),
          radioQ('10.7 Public address system?'),
        ],
      },
      {
        title: '11. LIFTS',
        questions: [
          radioQ('Comprehensive reports for service?'),
          radioQ('11.1 Lift Service Item 1'),
        ],
      },
      {
        title: '12. TOOLS OF TRADE',
        questions: [
          radioQ('12.1 Cell phone?'),
          radioQ('12.2 Office furniture?'),
          radioQ('12.3 Transport?'),
          radioQ('12.4 Stationery?'),
          radioQ('12.5 Laptop?'),
        ],
      },
      {
        title: '13. OHS COMPLIANCE FILE',
        questions: [
          radioQ('Records kept and regularly updated?'),
          radioQ('13.1 Assessments / inspections?'),
          radioQ('13.2 Risk assessments?'),
          radioQ('13.3 Events?'),
          radioQ('13.4 Reports?'),
          radioQ('13.5 Meetings?'),
          radioQ('13.6 All OHS compliance documents?'),
        ],
      },
      {
        title: '14. ADDITIONAL ITEMS',
        questions: [
          { label: 'Additional Items', inputType: InputType.TEXTAREA, placeholder: 'Enter additional items ...' },
          { label: 'Quality and Verification Audit Findings', inputType: InputType.TEXTAREA, placeholder: 'Enter quality and verification audit findings ...' },
        ],
      },
      {
        title: '15. RECOMMENDATIONS',
        questions: [
          { label: 'Recommendations', inputType: InputType.TEXTAREA, placeholder: 'Enter recommendations ...' },
          { label: 'Quality Monitoring and Verification Assessment Conducted by:', inputType: InputType.TEXTAREA, placeholder: 'Ms Prudence Sibeko\nASD: Occupational Health and Safety\n\n_________________________\nDate' },
        ],
      },
    ],
  },

  // ── 3. OHS Inspection Checklist ───────────────────────────────────────────
  {
    slug: 'ohs-inspection-checklist',
    title: 'OHS INSPECTION CHECKLIST',
    description: 'Detailed workplace safety inspection checklist.',
    sections: [
      {
        title: 'Header Information',
        questions: [
          textQ('NAME OF THE BUILDING', 'Enter building name'),
          dateQ('DATE OF INSPECTION'),
        ],
      },
      {
        title: '1. OHSA ORGANISATIONAL MANAGEMENT',
        questions: [
          radioQ('1.1 Is there a copy of the OHS Act prominently displayed in a visible area? Section 7'),
          radioQ('1.2 Is there an approved OHS Policy? Section 7'),
          radioQ('1.3 Is there an OHS Policy Statement displayed in a visible area? Section 7'),
          radioQ('1.4 Are there statutory appointments available and signed by the 16.1? Section 16'),
          radioQ('Section 16.2'),
          radioQ('Section 17.1 (health and safety representatives)'),
          radioQ('Section 19.1 (health and safety committee)'),
          radioQ('GAR 9(2) (General Administration Regulation)'),
          radioQ('Evacuation Marshal'),
          radioQ('GSR3.4 First Aider'),
          radioQ('GSR4 Fire Fighter'),
          radioQ('1.5 Did the statutory appointees attended any Liability Training Course? Section 8'),
          radioQ('1.6 Did the appointed OHS members subjected to a formal training on OHS, Basic fire-fighting, evacuation procedures and first aid? Section 8'),
          radioQ('1.7 Are there any terms of reference (ToR) for OHS Committee?'),
          radioQ('1.8 Are all symbolic signs displayed on site?'),
        ],
      },
      {
        title: '2. GENERAL SAFETY REGULATIONS',
        questions: [
          radioQ('2.1 Is there storage of flammable liquids if used on site? GSR'),
          radioQ('2.2 Is there work in confine spaces? GSR'),
          radioQ('2.3 Is there work at elevated platforms? GSR'),
          radioQ('2.4 Is there PPE procedure? GSR'),
          radioQ('2.5 Is there a register to control the issuing of PPE? GSR'),
          radioQ('2.6 Is there an SOP on good stacking and storage practices? GSR'),
          radioQ('2.7 Is the work-station design as per Building Regulation? GSR'),
          radioQ('2.8 Is there a provision of first box (es) at the workplace and accessible when a need arises? GSR'),
          radioQ('2.9 Is there a notice or sign in a conspicuous area at the workplace indicating the location of a first aid box(es)? GSR'),
          radioQ('2.10 Is the first aid box(es) filled with the minimum contents as required by the GSR for office environment? GSR'),
          radioQ('2.11 Are there any procedures developed to assist in a case of injury on duty? GSR'),
          radioQ('2.12 Is the workplace provided with a ramp (to cater for people with disabilities) that is constructed in accordance with acceptable standards?'),
        ],
      },
      {
        title: '3. GENERAL ADMINISTRATION REGULATIONS',
        questions: [
          radioQ('3.1 Are all incidents recorded and reported using WCL2 or Annexure 2? (Near-miss, Injuries, Medical, Fatalities)'),
          radioQ('3.2 Is there an incident register for any incident that may occur in the workplace? GSR'),
          radioQ('3.3 investigations done by the competent person? GSR'),
        ],
      },
      {
        title: '4. REGULATION for HAZARDOUS BIOLOGICAL AGENTS',
        questions: [
          radioQ('4.1 Are there HBA being processed on site?'),
          radioQ('4.2 Is there a provision of personal protective equipment to officials exposed to HBA?'),
          radioQ('4.3 Is training provided to people who might be exposed to HBA?'),
          radioQ('4.4 Is there a risk assessment conducted?'),
          radioQ('4.5 Is there a Departmental Medical Surveillance Policy? (Included in OHS Policy)'),
          radioQ('4.6 Are officials working in an environment where they might be exposed to HBA subjected to pre-employment, periodic and post medical surveillance?'),
        ],
      },
      {
        title: '5. ENVIRONMENTAL REGULATIONS FOR WORKPLACES',
        questions: [
          radioQ('5.1 Is the workplace illuminated (lighting) in accordance with the illuminance value? ERW'),
          radioQ('5.2 Are there precautionary measures in place for means of egress? ERW'),
          radioQ('5.3 Is the emergency escape door opening outward? ERW'),
          radioQ('5.4 Are staircases provided with a safe handrail? ERW'),
          radioQ('5.5 Is the workplace well ventilated either by natural or mechanical means? ERW'),
          radioQ('5.6 Is the indoor workplace (floors, stairs, passages and gangways) kept clean and state of repairs, skid-free and free from any obstruction? ERW'),
          radioQ('5.7 Is there an Emergency / Evacuation plan in the workplace? ERW'),
          radioQ('5.8 Is there an Emergency Preparedness Team appointed in your department? (Fire fighters, First Aiders, Evacuation Marshall, Communication leader)'),
          radioQ('5.9 Is there emergency evacuation preparedness drill conducted (once or twice a year)?'),
          radioQ('5.10 Is housekeeping maintained in accordance with the Regulation? ERW'),
          radioQ('5.11 Is there a waste management plan?'),
        ],
      },
      {
        title: '6. REGULATIONS FOR HAZARDOUS CHEMICAL SUBSTANCES',
        questions: [
          radioQ('6.1 Is there a procedure on chemical handling and transportation? Chemicals should be SABS approved.'),
          radioQ('6.2 Is there storage for hazardous chemicals substances?'),
          radioQ('6.3 Is the Material safety Data Sheet (MSDS) displayed for all hazardous chemicals substances?'),
        ],
      },
      {
        title: '7. ELETRICAL INSTALLATION REGULATIONS',
        questions: [
          radioQ('7.1 Is there a valid Certificate of Compliance on site for the building?'),
          radioQ('7.2 Is all Electrical Equipment inspected and maintained by a competent person?'),
          radioQ('7.3 Is labelling done according to the regulations?'),
          radioQ('7.4 Are all electrical wires insulated and proper plugs used in your workplace?'),
        ],
      },
      {
        title: '8. PRESSURE EQUIPMENT REGULATIONS',
        questions: [
          radioQ('8.1 Is there a provision of fire extinguishers, fire hose reels onsite?'),
          radioQ('8.2 Are these equipment serviced/ maintained/tested in accordance with the Regulations?'),
        ],
      },
      {
        title: '9. ELECTRICAL INSTALLATION REGULATIONS (Cont.)',
        questions: [
          radioQ('9.1 Is there an Approved Inspection Authority (AIA) to inspect, test or investigate for any installed electricity?'),
          radioQ('9.2 Is there a valid Certificate of Compliance for the installation of electricity?'),
          radioQ('9.3 Are there any fire safety precautionary measures for any electrical installations?'),
        ],
      },
      {
        title: '10. LIFT, ESCALATOR AND PASSANGER CONVEYOR REGULATIONS',
        questions: [
          radioQ('10.1 Is the lift/escalator inspected and tested in accordance with the relevant health & safety standards? LEPCR'),
          radioQ('10.2 Is maintenance done as per the Regulation? LEPCR'),
          radioQ('10.3 Are records of any maintenance/tests available on site? LEPCR'),
        ],
      },
      {
        title: '11. FACILITIES REGULATIONS',
        questions: [
          radioQ('11.1 Sanitation: Is there a provision of ablution facilities with a conspicuous sign outside the entrance? FR'),
          radioQ('11.2 Is there a provision of an ablution facility for cater for persons with disabilities? FR'),
          radioQ('11.3 Are these facilities regularly cleaned? FR'),
          radioQ('11.4 Are hand drying facilities always available e.g. paper towels? FR'),
          radioQ('11.5 Is there running water? FR'),
          radioQ('11.6 Is there provision of soap? FR'),
          radioQ('11.7 Is there a waste and sanitary bins available? FR'),
          radioQ('11.8 Is there a designated smoking area that is well ventilated? FR'),
          radioQ('11.9 Is there provision of an ergonomically sound seat for every employee? FR'),
          radioQ('11.10 Is there an occupancy certificate for the building? FR'),
          radioQ('11.11 Is the premises accessible for persons with disabilities?'),
          radioQ('11.12 Is there a demarcated parking for people with disabilities?'),
          radioQ('11.13 Are evacuation chairs provided for in case of an emergency?'),
        ],
      },
      {
        title: 'Signatures',
        questions: [
          { label: 'OHS OFFICIAL NAME', inputType: InputType.TEXT, placeholder: 'Enter name' },
          { label: 'OHS OFFICIAL DESIGNATION', inputType: InputType.TEXT, placeholder: 'Enter designation' },
          { label: 'OHS OFFICIAL DATE', inputType: InputType.DATE },
          { label: '16.2 APPOINTEE NAME', inputType: InputType.TEXT, placeholder: 'Enter name' },
          { label: '16.2 APPOINTEE DESIGNATION', inputType: InputType.TEXT, placeholder: 'Enter designation' },
          { label: '16.2 APPOINTEE DATE', inputType: InputType.DATE },
        ],
      },
    ],
  },

  // ── 4. Pre-Occupation Building Assessment ─────────────────────────────────
  {
    slug: 'pre-occupation-building-assessment',
    title: 'PRE-OCCUPATION BUILDING ASSESSMENT CHECKLIST',
    description: 'Check pre-occupation / building safety assessment.',
    sections: [
      {
        title: 'General Information',
        questions: [
          textQ('Name of the Building', 'Enter name of the building'),
          textQ('Address', 'Enter address'),
          dateQ('Date of Inspection'),
          textQ('Construction Type', 'Enter construction type'),
          textQ('Description', 'Enter description'),
        ],
      },
      {
        title: '1. Occupancy Classification',
        questions: [
          radioQ('1.1 Specific use?'),
          radioQ('1.2 Number of stories?'),
          radioQ('1.3 Walls and floors in good order?'),
          radioQ('1.4 Area in sq. ft. per floor proposed for use?'),
          radioQ('1.5 Mixed occupancy?'),
          radioQ('1.6 Construction separation?'),
        ],
      },
      {
        title: '2. Structure',
        questions: [radioQ('2.1 Walls and floors in good order?')],
      },
      {
        title: '3A. Fire Protection - Fire Alarm System',
        questions: [
          radioQ('A.1 Fire alarm system available? Manual/Automatic and functionality'),
          radioQ('A.2 Heat detectors?'),
          radioQ('A.3 Smoke detectors?'),
          radioQ('A.4 Testing intervals?'),
          radioQ('A.5 Date of last service?'),
          radioQ('A.6 Service/maintenance provider?'),
          radioQ('A.7 Communication (PA) system present and audible in all floors?'),
        ],
      },
      {
        title: '3B. Fire Protection - Fire Extinguishers',
        questions: [
          radioQ('B.1 Fire extinguishers present and readily accessible?'),
          radioQ('B.2 Inspected/tested monthly and serviced annually?'),
          radioQ('B.3 Service/maintenance provider?'),
        ],
      },
      {
        title: '3C. Fire Protection - Sprinklers',
        questions: [
          radioQ('C.1 Sprinklers present?'),
          radioQ('C.2 Date of last inspection/test?'),
          radioQ('C.3 Maintenance provider?'),
          radioQ('C.4 Sprinkler system plate present?'),
        ],
      },
      {
        title: '3D. Fire Protection - Hoses and Fire Hydrants',
        questions: [
          radioQ('D.1 Date of last inspection/test?'),
          radioQ('D.2 Maintenance provider?'),
        ],
      },
      {
        title: '4. Electrical Installations and Lighting',
        questions: [
          radioQ('4.1 Is all Electrical installations inspected and maintained by a competent person?'),
          radioQ('4.2 Are all electrical wires insulated?'),
          radioQ('4.3 Are the distribution boards properly marked/labelled and secured?'),
          radioQ('4.4 Is there a provision of a generator placed in an approved location?'),
          radioQ('4.5 Are there sufficient emergency lights in the building?'),
        ],
      },
      {
        title: '5. Emergency Exits and Means of Egress',
        questions: [
          radioQ('5.1 Are there precautionary measures in place for means of egress?'),
          radioQ('5.2 Emergency escape door/s opening outward?'),
          radioQ('5.3 Emergency / Evacuation plan available?'),
          radioQ('5.4 Approved floor plans of the building available?'),
          radioQ('5.5 Are all designated fire/emergency escape routes clear of any obstructions?'),
          radioQ('5.6 Are emergency contact details displayed in visible areas?'),
          radioQ('5.7 Exits doors clear of hazards?'),
          radioQ('5.8 Exit illumination present?'),
          radioQ('5.9 Number of emergency exit doors?'),
        ],
      },
      {
        title: '6. Lifts and Escalators',
        questions: [
          radioQ("6.1 Fireman's lift available and properly marked?"),
          radioQ('6.2 Name and telephone number of the competent lift service provider affixed on the lift?'),
          radioQ('6.3 Are all the lift/s regularly inspected and tested?'),
          radioQ('6.4 Are the lift/s examined by a competent lift service provider?'),
          radioQ('6.5 Are there any maintenance records kept in the lift compartment?'),
        ],
      },
      {
        title: '7. Ventilation',
        questions: [radioQ('7.1 Ventilation system mechanical/natural?')],
      },
      {
        title: '8. Ablution Facilities',
        questions: [
          radioQ('8.1 Number of ablution facilities?'),
          radioQ('8.2 Are all the toilets in a working order? (No leaks and/or defects)'),
        ],
      },
      {
        title: '9. Compliance Documents',
        questions: [
          radioQ('9.1 Occupancy Certificate available?'),
          radioQ('9.2 Municipal approved building plans?'),
          radioQ('9.3 Relevant documentation from town planning?'),
          radioQ('9.4 Engineering completion certificate signed by a registered structural/civil engineer?'),
          radioQ('9.5 Roof truss certificate issued by a competent person or structural engineer?'),
          radioQ('9.6 Plumbing certificate issued by a registered plumber?'),
          radioQ('9.7 Glazing certificate issued by a glazing installer?'),
          radioQ('9.8 Electrical certificate issued by a registered electrician?'),
          radioQ('9.9 Fire certificate?'),
          radioQ('9.10 Gas certificate issued by a registered gas installer?'),
          radioQ('9.11 Architectural certificate issued by the appointed registered person?'),
        ],
      },
      {
        title: 'General Remarks & Approval',
        questions: [
          { label: 'General Remarks', inputType: InputType.TEXTAREA, placeholder: 'Enter remarks' },
          textQ('OHS OFFICIAL NAME', 'Enter name'),
          textQ('OHS OFFICIAL DESIGNATION', 'Enter designation'),
          dateQ('OHS OFFICIAL DATE'),
          textQ('APPROVAL NAME', 'Enter name'),
          textQ('APPROVAL DESIGNATION', 'Enter designation'),
          dateQ('APPROVAL DATE'),
        ],
      },
    ],
  },

  // ── 5. Hazard Identification Risk Assessment (HIRA) ───────────────────────
  {
    slug: 'ohs-hazard-report',
    title: 'OHS HAZARD IDENTIFICATION RISK ASSESSMENT',
    description: 'Identify workplace hazards, assess the associated risks and document control measures.',
    sections: [
      {
        title: 'General Information',
        questions: [
          { ...textQ('Completed by', 'Enter name of the inspector'), isRequired: true },
          { ...textQ('Team Members', 'Enter members'), isRequired: true },
          { ...dateQ('Date Compiled'), isRequired: true },
          { ...dateQ('Date of Review'), isRequired: true },
        ],
      },
      {
        title: 'Reference NO.',
        questions: [textQ('Reference NO.', 'Enter reference number')],
      },
      {
        title: 'Activity',
        questions: [
          {
            label: 'List specific activities to be performed taking into consideration the equipment to be used, the personnel involved in the task',
            inputType: InputType.TEXTAREA,
            placeholder: 'Enter activities',
          },
        ],
      },
      {
        title: 'Hazard',
        questions: [
          {
            label: 'A hazard is anything that is likely to lead to an event that will have an adverse impact on achieving an objective. A hazard can pose more than one risk',
            inputType: InputType.TEXTAREA,
            placeholder: 'Enter hazard',
          },
        ],
      },
      {
        title: 'Risk',
        questions: [
          {
            label: 'A physical event that occurs or could occur in relation to the hazard',
            inputType: InputType.TEXTAREA,
            placeholder: 'Enter risk',
          },
        ],
      },
      {
        title: 'Risk Type',
        questions: [textQ('Risk Type (S/H/E/Q)', 'Enter risk type')],
      },
      {
        title: 'Activity Type',
        questions: [textQ('Activity Type (Abnormal, Normal or Emergency)', 'Enter activity type')],
      },
      {
        title: 'Risk Owner',
        questions: [
          {
            label: 'Who is accountable for making sure the controls and monitors are: in place, implemented, regularly reviewed for effectiveness',
            inputType: InputType.TEXTAREA,
            placeholder: 'Enter risk owner',
          },
        ],
      },
      {
        title: 'Risk Rating',
        questions: [
          { label: 'Likelihood', inputType: InputType.TEXTAREA, placeholder: 'Enter likelihood' },
          { label: 'Consequences', inputType: InputType.TEXTAREA, placeholder: 'Enter consequences' },
          textQ('Risk Rating (L x C)', 'Enter risk rating'),
        ],
      },
      {
        title: 'Existing Controls',
        questions: [
          {
            label: 'Include: Preventative Controls (controls implemented to eliminate hazards or reduce the likelihood of the risk occurring), and Reactive Controls (controls implemented to reduce the immediate impact of the risk occurring)',
            inputType: InputType.TEXTAREA,
            placeholder: 'Enter existing controls',
          },
        ],
      },
      {
        title: 'Residual Risk Rating',
        questions: [
          textQ('Effectiveness of Control', 'Enter effectiveness of control'),
          textQ('Residual risk = Risk Rating - Effectiveness of Control', 'Enter residual risk'),
        ],
      },
      {
        title: 'Recommended Additional Control Measures',
        questions: [
          {
            label: 'Additional control measures recommended to reduce the residual risk rating',
            inputType: InputType.TEXTAREA,
            placeholder: 'Enter additional control',
          },
        ],
      },
      {
        title: 'Residual Risk Rating (After Additional Controls)',
        questions: [
          textQ('Effectiveness of Control', 'Enter effectiveness of control'),
          textQ('Residual risk = Risk Rating - Effectiveness of Control', 'Enter residual risk'),
        ],
      },
    ],
  },
];

// ─── Seed runner ──────────────────────────────────────────────────────────────

async function seedForm(formSeed: FormSeed) {
  // Create the Form identity
  const form = await prisma.form.create({
    data: { slug: formSeed.slug },
  });

  // Create a FormVersion (DRAFT first, then we'll publish it inline)
  const version = await prisma.formVersion.create({
    data: {
      formId: form.id,
      versionNumber: 1,
      title: formSeed.title,
      description: formSeed.description,
      status: FormVersionStatus.DRAFT,
      isActive: false,
    },
  });

  // Create canvas: sections → questions → options
  const schemasections: any[] = [];

  for (let sIdx = 0; sIdx < formSeed.sections.length; sIdx++) {
    const sSeed = formSeed.sections[sIdx];
    const section = await prisma.formSection.create({
      data: {
        formVersionId: version.id,
        title: sSeed.title,
        orderIndex: sIdx,
      },
    });

    const schemaQuestions: any[] = [];
    for (let qIdx = 0; qIdx < sSeed.questions.length; qIdx++) {
      const qSeed = sSeed.questions[qIdx];
      const question = await prisma.questionInput.create({
        data: {
          sectionId: section.id,
          label: qSeed.label,
          inputType: qSeed.inputType,
          placeholder: qSeed.placeholder ?? null,
          isRequired: qSeed.isRequired ?? false,
          orderIndex: qIdx,
        },
      });

      const schemaOptions: any[] = [];
      if (qSeed.options?.length) {
        for (let oIdx = 0; oIdx < qSeed.options.length; oIdx++) {
          const oSeed = qSeed.options[oIdx];
          const option = await prisma.questionOption.create({
            data: {
              questionId: question.id,
              optionLabel: oSeed.optionLabel,
              optionValue: oSeed.optionValue,
              orderIndex: oIdx,
            },
          });
          schemaOptions.push({ id: option.id, optionLabel: oSeed.optionLabel, optionValue: oSeed.optionValue, orderIndex: oIdx });
        }
      }

      schemaQuestions.push({
        id: question.id,
        label: qSeed.label,
        inputType: qSeed.inputType,
        placeholder: qSeed.placeholder ?? null,
        isRequired: qSeed.isRequired ?? false,
        orderIndex: qIdx,
        validationRules: null,
        options: schemaOptions,
      });
    }

    schemasections.push({
      id: section.id,
      title: sSeed.title,
      description: null,
      orderIndex: sIdx,
      questions: schemaQuestions,
    });
  }

  // Publish: freeze schema, set active
  const schema = { sections: schemasections };
  await prisma.formVersion.update({
    where: { id: version.id },
    data: {
      status: FormVersionStatus.PUBLISHED,
      isActive: true,
      publishedAt: new Date(),
      schema,
    },
  });

  console.log(`✅ Seeded: ${formSeed.title} (v1 published)`);
}

async function main() {
  console.log('🗑️  Clearing existing forms…');
  await prisma.form.deleteMany({});

  console.log('🌱 Seeding OHS Forms…');
  for (const formSeed of forms) {
    await seedForm(formSeed);
  }
  console.log('✨ Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
