export const DIVISIONS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
  'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
];

export const HEIGHT_RANGES = [
  'Below 5\'0"',
  '5\'0" - 5\'3"',
  '5\'3" - 5\'6"',
  '5\'6" - 5\'9"',
  '5\'9" - 6\'0"',
  '6\'0" - 6\'3"',
  'Above 6\'3"',
];

// Values are in kg; the unit is added at display time.
export const WEIGHT_RANGES = [
  'Below 40',
  ...Array.from({ length: 12 }, (_, i) => `${40 + i * 5} - ${45 + i * 5}`),
  'Above 100',
];

export const OCCUPATIONS = [
  'Student',
  'Engineer',
  'Software Professional',
  'Doctor',
  'Nurse',
  'Pharmacist',
  'Teacher / Professor',
  'Lawyer',
  'Chartered Accountant',
  'Accountant',
  'Banking Professional',
  'Government Employee',
  'Police / Defence Services',
  'Architect',
  'Business / Entrepreneur',
  'Self Employed',
  'Farmer / Agriculture',
  'Mechanic / Technician',
  'Driver',
  'Hospitality / Hotel Management',
  'Marketing / Sales',
  'Designer / Creative',
  'Journalist / Media',
  'Researcher / Scientist',
  'Merchant Navy / Seafarer',
  'Gulf / Overseas Employee',
  'Homemaker',
  'Not Working',
  'Other',
];
export const RACES = ['Fair', 'Medium', 'Dark'];

// Keep in sync with backend/routes/admin.js (PROFILE_IMAGE_MIN / _MAX).
export const IMAGE_RULES = {
  min: 4,
  max: 5,
  maxSizeMB: 2,
  accept: ['image/jpeg', 'image/png', 'image/webp'],
};
