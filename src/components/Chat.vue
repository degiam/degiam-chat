<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Form } from '@primevue/forms';
import { FormField } from '@primevue/forms';
// import Toast from 'primevue/toast';
// import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';
import WhatsAppLogo from '../assets/brand-whatsapp.svg';
import TelegramLogo from '../assets/brand-telegram.svg';
import Brand from './Brand.vue';

type Platform = {
  name: string,
  code: string,
  logo: string,
  field: {
    phone: boolean,
    username: boolean,
  },
}

type FormValue = {
  phone: {
    show: boolean,
    value: string,
  },
  username: {
    show: boolean,
    value: string,
  },
}

const fallbackImage = 'https://via.placeholder.com/24x24/eee/eee';

const selectedPlatform = ref<Platform | null>(null);
const dataPlatform = ref([
  { name: 'WhatsApp', code: 'whatsapp', logo: WhatsAppLogo, field: { phone: true, username: false } },
  { name: 'Telegram', code: 'telegram', logo: TelegramLogo, field: { phone: false, username: true } },
]);
selectedPlatform.value = dataPlatform.value.find(item => item.code === 'whatsapp') || null;

const selectedCountry = ref();
const dataCountry = ref([
  { name: 'AF', code: '+93', title: 'Afganistan' },
  { name: 'ZA', code: '+27', title: 'Afrika Selatan' },
  { name: 'CF', code: '+236', title: 'Afrika Tengah' },
  { name: 'AL', code: '+355', title: 'Albania' },
  { name: 'DZ', code: '+213', title: 'Algeria' },
  { name: 'US', code: '+1', title: 'Amerika Serika' },
  { name: 'AD', code: '+376', title: 'Andorra' },
  { name: 'AO', code: '+244', title: 'Angola' },
  { name: 'AG', code: '+1-268', title: 'Antigua & Barbuda' },
  { name: 'SA', code: '+966', title: 'Arab Saudi' },
  { name: 'AR', code: '+54', title: 'Argentina' },
  { name: 'AM', code: '+374', title: 'Armenia' },
  { name: 'AU', code: '+61', title: 'Australia' },
  { name: 'AT', code: '+43', title: 'Austria' },
  { name: 'AZ', code: '+994', title: 'Azerbaijan' },
  { name: 'BS', code: '+1-242', title: 'Bahama' },
  { name: 'BH', code: '+973', title: 'Bahrain' },
  { name: 'BD', code: '+880', title: 'Bangladesh' },
  { name: 'BB', code: '+1-246', title: 'Barbados' },
  { name: 'NL', code: '+31', title: 'Belanda' },
  { name: 'BY', code: '+375', title: 'Belarus' },
  { name: 'BE', code: '+32', title: 'Belgia' },
  { name: 'BZ', code: '+501', title: 'Belize' },
  { name: 'BJ', code: '+229', title: 'Benin' },
  { name: 'BT', code: '+975', title: 'Bhutan' },
  { name: 'BO', code: '+591', title: 'Bolivia' },
  { name: 'BA', code: '+387', title: 'Bosnia & Herzegovina' },
  { name: 'BW', code: '+267', title: 'Botswana' },
  { name: 'BR', code: '+55', title: 'Brazil' },
  { name: 'GB', code: '+44', title: 'Britania Raya (Inggris)' },
  { name: 'BN', code: '+673', title: 'Brunei Darussalam' },
  { name: 'BG', code: '+359', title: 'Bulgaria' },
  { name: 'BF', code: '+226', title: 'Burkina Faso' },
  { name: 'BI', code: '+257', title: 'Burundi' },
  { name: 'CZ', code: '+420', title: 'Ceko' },
  { name: 'TD', code: '+235', title: 'Chad' },
  { name: 'CL', code: '+56', title: 'Chili' },
  { name: 'CN', code: '+86', title: 'China' },
  { name: 'DK', code: '+45', title: 'Denmark' },
  { name: 'DJ', code: '+253', title: 'Djibouti' },
  { name: 'DM', code: '+1-767', title: 'Dominika' },
  { name: 'EC', code: '+593', title: 'Ekuador' },
  { name: 'SV', code: '+503', title: 'El Salvador' },
  { name: 'ER', code: '+291', title: 'Eritrea' },
  { name: 'EE', code: '+372', title: 'Estonia' },
  { name: 'ET', code: '+251', title: 'Ethiopia' },
  { name: 'FJ', code: '+679', title: 'Fiji' },
  { name: 'PH', code: '+63', title: 'Filipina' },
  { name: 'FI', code: '+358', title: 'Finlandia' },
  { name: 'GA', code: '+241', title: 'Gabon' },
  { name: 'GM', code: '+220', title: 'Gambia' },
  { name: 'GE', code: '+995', title: 'Georgia' },
  { name: 'GH', code: '+233', title: 'Ghana' },
  { name: 'GD', code: '+1-473', title: 'Grenada' },
  { name: 'GT', code: '+502', title: 'Guatemala' },
  { name: 'GN', code: '+224', title: 'Guinea' },
  { name: 'GW', code: '+245', title: 'Guinea-Bissau' },
  { name: 'GQ', code: '+240', title: 'Guinea Khatulistiwa' },
  { name: 'GY', code: '+592', title: 'Guyana' },
  { name: 'HT', code: '+509', title: 'Haiti' },
  { name: 'HN', code: '+504', title: 'Honduras' },
  { name: 'HU', code: '+36', title: 'Hongaria' },
  { name: 'HK', code: '+852', title: 'Hong Kong' },
  { name: 'IN', code: '+91', title: 'India' },
  { name: 'ID', code: '+62', title: 'Indonesia' },
  { name: 'IQ', code: '+964', title: 'Irak' },
  { name: 'IR', code: '+98', title: 'Iran' },
  { name: 'IE', code: '+353', title: 'Irlandia' },
  { name: 'IS', code: '+354', title: 'Islandia' },
  { name: 'IL', code: '+972', title: 'Israel' },
  { name: 'IT', code: '+39', title: 'Italia' },
  { name: 'JM', code: '+1-876', title: 'Jamaika' },
  { name: 'JP', code: '+81', title: 'Jepang' },
  { name: 'DE', code: '+49', title: 'Jerman' },
  { name: 'JO', code: '+962', title: 'Yordania' },
  { name: 'KH', code: '+855', title: 'Cambodia' },
  { name: 'CM', code: '+237', title: 'Kamboja' },
  { name: 'CA', code: '+1', title: 'Kanada' },
  { name: 'KZ', code: '+7', title: 'Kazakhstan' },
  { name: 'KE', code: '+254', title: 'Kenya' },
  { name: 'KG', code: '+996', title: 'Kirgizstan' },
  { name: 'KI', code: '+686', title: 'Kiribati' },
  { name: 'CO', code: '+57', title: 'Kolombia' },
  { name: 'KM', code: '+269', title: 'Komoro' },
  { name: 'CD', code: '+243', title: 'Kongo' },
  { name: 'KR', code: '+82', title: 'Korea Selatan' },
  { name: 'KP', code: '+850', title: 'Korea Utara' },
  { name: 'CR', code: '+506', title: 'Kosta Rika' },
  { name: 'HR', code: '+385', title: 'Kroatia' },
  { name: 'CU', code: '+53', title: 'Kuba' },
  { name: 'KW', code: '+965', title: 'Kuwait' },
  { name: 'LA', code: '+856', title: 'Laos' },
  { name: 'LV', code: '+371', title: 'Latvia' },
  { name: 'LB', code: '+961', title: 'Lebanon' },
  { name: 'LS', code: '+266', title: 'Lesotho' },
  { name: 'LR', code: '+231', title: 'Liberia' },
  { name: 'LY', code: '+218', title: 'Libya' },
  { name: 'LI', code: '+423', title: 'Liechtenstein' },
  { name: 'LT', code: '+370', title: 'Lithuania' },
  { name: 'LU', code: '+352', title: 'Luksemburg' },
  { name: 'MG', code: '+261', title: 'Madagaskar' },
  { name: 'MO', code: '+853', title: 'Makao' },
  { name: 'MK', code: '+389', title: 'Makedonia Utara' },
  { name: 'MV', code: '+960', title: 'Maladewa' },
  { name: 'MW', code: '+265', title: 'Malawi' },
  { name: 'MY', code: '+60', title: 'Malaysia' },
  { name: 'ML', code: '+223', title: 'Mali' },
  { name: 'MT', code: '+356', title: 'Malta' },
  { name: 'MA', code: '+212', title: 'Maroko' },
  { name: 'MH', code: '+692', title: 'Kep. Marshall' },
  { name: 'MR', code: '+222', title: 'Mauritania' },
  { name: 'MU', code: '+230', title: 'Mauritius' },
  { name: 'MX', code: '+52', title: 'Meksiko' },
  { name: 'EG', code: '+20', title: 'Mesir' },
  { name: 'FM', code: '+691', title: 'Kep. Mikronesia' },
  { name: 'MD', code: '+373', title: 'Moldova' },
  { name: 'MC', code: '+377', title: 'Monako' },
  { name: 'MN', code: '+976', title: 'Mongolia' },
  { name: 'ME', code: '+382', title: 'Montenegro' },
  { name: 'MZ', code: '+258', title: 'Mozambik' },
  { name: 'MM', code: '+95', title: 'Myanmar' },
  { name: 'NA', code: '+264', title: 'Namibia' },
  { name: 'NR', code: '+674', title: 'Nauru' },
  { name: 'NP', code: '+977', title: 'Nepal' },
  { name: 'NE', code: '+227', title: 'Niger' },
  { name: 'NG', code: '+234', title: 'Nigeria' },
  { name: 'NI', code: '+505', title: 'Nikaragua' },
  { name: 'NO', code: '+47', title: 'Norwegia' },
  { name: 'OM', code: '+968', title: 'Oman' },
  { name: 'PK', code: '+92', title: 'Pakistan' },
  { name: 'PW', code: '+680', title: 'Palau' },
  { name: 'PA', code: '+507', title: 'Panama' },
  { name: 'CI', code: '+225', title: 'Pantai Gading' },
  { name: 'PG', code: '+675', title: 'Papua Nugini' },
  { name: 'PY', code: '+595', title: 'Paraguay' },
  { name: 'FR', code: '+33', title: 'Prancis' },
  { name: 'PE', code: '+51', title: 'Peru' },
  { name: 'PL', code: '+48', title: 'Polandia' },
  { name: 'PT', code: '+351', title: 'Portugal' },
  { name: 'QA', code: '+974', title: 'Qatar' },
  { name: 'CG', code: '+242', title: 'Kongo' },
  { name: 'DO', code: '+1-809', title: 'Dominika' },
  { name: 'DO', code: '+1-829', title: 'Dominika' },
  { name: 'RO', code: '+40', title: 'Rumania' },
  { name: 'RU', code: '+7', title: 'Rusia' },
  { name: 'RW', code: '+250', title: 'Rwanda' },
  { name: 'KN', code: '+1-869', title: 'Saint Kitts & Nevis' },
  { name: 'LC', code: '+1-758', title: 'Saint Lucia' },
  { name: 'VC', code: '+1-784', title: 'Saint Vincent & the Grenadines' },
  { name: 'WS', code: '+685', title: 'Samoa' },
  { name: 'SM', code: '+378', title: 'San Marino' },
  { name: 'ST', code: '+239', title: 'São Tomé & Príncipe' },
  { name: 'NZ', code: '+64', title: 'Selandia Baru' },
  { name: 'SN', code: '+221', title: 'Senegal' },
  { name: 'RS', code: '+381', title: 'Serbia' },
  { name: 'SC', code: '+248', title: 'Seychelles' },
  { name: 'SL', code: '+232', title: 'Sierra Leone' },
  { name: 'SG', code: '+65', title: 'Singapura' },
  { name: 'CY', code: '+357', title: 'Siprus' },
  { name: 'SI', code: '+386', title: 'Slovenia' },
  { name: 'SK', code: '+421', title: 'Slowakia' },
  { name: 'SB', code: '+677', title: 'Kep. Solomon' },
  { name: 'SO', code: '+252', title: 'Somalia' },
  { name: 'ES', code: '+34', title: 'Spanyol' },
  { name: 'LK', code: '+94', title: 'Sri Lanka' },
  { name: 'SD', code: '+249', title: 'Sudan' },
  { name: 'SS', code: '+211', title: 'Sudan Selatan' },
  { name: 'SY', code: '+963', title: 'Suriah' },
  { name: 'SR', code: '+597', title: 'Suriname' },
  { name: 'SZ', code: '+268', title: 'Swaziland' },
  { name: 'SE', code: '+46', title: 'Swedia' },
  { name: 'CH', code: '+41', title: 'Swiss' },
  { name: 'TJ', code: '+992', title: 'Tajikistan' },
  { name: 'CV', code: '+238', title: 'Tanjung Verde' },
  { name: 'TZ', code: '+255', title: 'Tanzania' },
  { name: 'TW', code: '+886', title: 'Taiwan' },
  { name: 'TH', code: '+66', title: 'Thailand' },
  { name: 'TL', code: '+670', title: 'Timor Leste' },
  { name: 'TG', code: '+228', title: 'Togo' },
  { name: 'TO', code: '+676', title: 'Tonga' },
  { name: 'TT', code: '+1-868', title: 'Trinidad & Tobago' },
  { name: 'TN', code: '+216', title: 'Tunisia' },
  { name: 'TR', code: '+90', title: 'Turki' },
  { name: 'TM', code: '+993', title: 'Turkmenistan' },
  { name: 'TV', code: '+688', title: 'Tuvalu' },
  { name: 'UG', code: '+256', title: 'Uganda' },
  { name: 'UA', code: '+380', title: 'Ukraina' },
  { name: 'AE', code: '+971', title: 'Uni Emirat Arab' },
  { name: 'UY', code: '+598', title: 'Uruguay' },
  { name: 'UZ', code: '+998', title: 'Uzbekistan' },
  { name: 'VU', code: '+678', title: 'Vanuatu' },
  { name: 'VE', code: '+58', title: 'Venezuela' },
  { name: 'VN', code: '+84', title: 'Vietnam' },
  { name: 'YE', code: '+967', title: 'Yaman' },
  { name: 'GR', code: '+30', title: 'Yunani' },
  { name: 'ZM', code: '+260', title: 'Zambia' },
  { name: 'ZW', code: '+263', title: 'Zimbabwe' },
]);
selectedCountry.value = dataCountry.value.find(item => item.code === '+62') || null;

const formData: FormValue = reactive({
  phone: {
    show: false,
    value: '',
  },
  username: {
    show: false,
    value: '',
  },
});

const phoneError = ref('');
const usernameError = ref('');

const phonePattern = /^(?:\+|08)[0-9]{9,14}$/;
const usernamePattern = /^[^\s]+$/;

const whitelistKeys = ['Enter', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowTop', 'ArrowBottom', 'Tab'];

const cleanPhoneNumber = (value: string): string => {
  return value.replace(/(?!^\+)[^\d]/g, '');
};
const cleanUsername = (value: string): string => {
  return value.replace(/\s+/g, '');
};

const validateInputPhone = () => {
  formData.phone.value = cleanPhoneNumber(formData.phone.value);

  const phone = formData.phone.value;

  if (!phone.startsWith('08') && !phone.startsWith('+')) {
    phoneError.value = 'Nomor ponsel harus diawali dengan 08 atau +';
  } else if (!phonePattern.test(phone)) {
    phoneError.value = 'Nomor ponsel minimal 10 digit dan maksimal 15 digit';
  } else {
    phoneError.value = '';
  }
};
const validateInputUsername = () => {
  formData.username.value = cleanUsername(formData.username.value);

  const username = formData.username.value;

  if (!usernamePattern.test(username)) {
    usernameError.value = 'Username tidak boleh mengandung spasi';
  } else {
    usernameError.value = '';
  }
};

const preventInvalidPhone = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement;
  const key = event.key;

  const currentValue = input.value;
  const cursorPosition = input.selectionStart || 0;
  const allowedChars = /^\d$/;

  if (whitelistKeys.includes(key)) {
    return;
  }

  if (key === '+') {
    if (cursorPosition !== 0 || currentValue.includes('+')) {
      event.preventDefault();
    }
    return;
  }

  if (!allowedChars.test(key)) {
    event.preventDefault();
  }
};
const preventInvalidUsername = (event: KeyboardEvent) => {
  const allowedChars = /^[^\s]$/;
  const key = event.key;

  if (whitelistKeys.includes(key)) {
    return;
  }

  if (!allowedChars.test(key)) {
    event.preventDefault();
  }
};

const resolver = ({ values }: { values: any }) => {
  const errors: Record<string, any> = {};

  if (!values.platform) {
    errors.platform = [{ message: 'Silakan pilih salah satu' }];
  }

  if (selectedPlatform.value?.field.phone && !values.phone) {
    errors.phone = [{ message: 'Nomor ponsel harus diisi' }];
  } else if (selectedPlatform.value?.field.phone && phoneError.value) {
    errors.phone = [{ message: phoneError.value }];
  }

  if (selectedPlatform.value?.field.username && !values.username) {
    errors.username = [{ message: 'Username harus diisi' }];
  } else if (selectedPlatform.value?.field.username && usernameError.value) {
    errors.username = [{ message: usernameError.value }];
  }

  return { errors };
};

// const toast = useToast();

const onFormSubmit = ({ valid }: { valid: boolean }) => {
  if (valid) {
    const platform = selectedPlatform.value?.code;
    const country = selectedCountry.value?.code;
    let phone = formData.phone.value ? `${country}${formData.phone.value.replace(/(^\+|0)/, '')}` : '';
    let username = formData.username.value;
    let link = '';

    if (platform === 'whatsapp') {
      link = `https://wa.me/${phone}`;
    } else if (platform === 'telegram') {
      link = `https://t.me/${username}`;
    }

    if (link) {
      if (window.innerWidth > 768) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    }

    // toast.add({
    //   severity: 'success',
    //   summary: 'Form berhasil dikirim',
    //   detail: 'Terima kasih atas partisipasinya',
    //   life: 5000
    // });
  }
};

watch(selectedPlatform, (newValue) => {
  if (newValue) {
    formData.phone.show = newValue.field.phone;
    formData.username.show = newValue.field.username;
  }
}, { immediate: true });
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-6 main-layout">
    <div class="w-full max-w-lg mb-20">

      <div class="w-fit mx-auto mb-4">
        <Brand />
      </div>

      <!-- <Toast /> -->

      <Form :initialValues="formData" :resolver="resolver" @submit="onFormSubmit" class="flex flex-col gap-6 w-full">
        <FormField v-slot="$field" name="platform" initialValue="whatsapp" class="flex flex-col gap-1">
          <Select v-model="selectedPlatform" :options="dataPlatform" checkmark :highlightOnSelect="false" optionLabel="name" placeholder="Silakan pilih..." fluid class="rounded-lg [&.p-focus]:shadow-[2px_2px_0_#22d3ee,-2px_2px_0_#22d3ee,2px_-2px_0_#22d3ee,-2px_-2px_0_#22d3ee]">
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center">
                <img v-if="slotProps.value.logo" :alt="slotProps.value.name" :src="slotProps.value.logo" @error="slotProps.value.logo = fallbackImage" class="w-5 mr-2" />
                <div v-else class="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                <div>{{ slotProps.value.name }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="flex items-center">
                <img v-if="slotProps.option.logo" :alt="slotProps.option.name" :src="slotProps.option.logo" @error="slotProps.option.logo = fallbackImage" class="w-5 mr-2" />
                <div v-else class="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Select>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple" class="mt-1">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-if="formData.phone.show" v-slot="$field" name="phone" initialValue="">
          <div class="flex gap-4">
            <div class="flex flex-col gap-1 w-fit">
              <Select v-model="selectedCountry" :options="dataCountry" name="country" initialValue="+62" filter checkmark :highlightOnSelect="false" optionLabel="title" placeholder="Silakan pilih..." fluid class="rounded-lg [&.p-focus]:shadow-[2px_2px_0_#22d3ee,-2px_2px_0_#22d3ee,2px_-2px_0_#22d3ee,-2px_-2px_0_#22d3ee]">
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center mr-4">
                    <img v-if="slotProps.value.name" :alt="slotProps.value.name" :src="`https://flagcdn.com/w20/${slotProps.value.name.toLowerCase()}.png`" @error="slotProps.value.name = fallbackImage" class="w-7 h-5 object-contain mr-2 border" />
                    <div v-else class="w-7 h-5 bg-gray-200 mr-2"></div>
                    <div>{{ slotProps.value.code }}</div>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center w-full">
                    <img v-if="slotProps.option.name" :alt="slotProps.option.name" :src="`https://flagcdn.com/w20/${slotProps.option.name.toLowerCase()}.png`" @error="slotProps.option.name = fallbackImage" class="w-7 h-5 object-contain mr-2 border" />
                    <div v-else class="w-7 h-5 bg-gray-200 mr-2"></div>
                    <div class="flex justify-between gap-2 w-full">
                      <div>{{ slotProps.option.code }}</div>
                      <div class="opacity-50">{{ slotProps.option.title }}</div>
                    </div>
                  </div>
                </template>
              </Select>
            </div>

            <div class="flex flex-col gap-1 w-full">
              <InputText
                v-model="formData.phone.value"
                @keydown="preventInvalidPhone"
                @input="validateInputPhone"
                type="tel"
                inputmode="numeric"
                placeholder="Nomor ponsel"
                fluid
                class="rounded-lg focus:shadow-[2px_2px_0_#22d3ee,-2px_2px_0_#22d3ee,2px_-2px_0_#22d3ee,-2px_-2px_0_#22d3ee]"
              />
            </div>
          </div>

          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple" class="mt-1">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-if="formData.username.show" v-slot="$field" name="username" initialValue="" class="flex flex-col gap-1">
          <InputText
            v-model="formData.username.value"
            @keydown="preventInvalidUsername"
            @input="validateInputUsername"
            type="text"
            placeholder="Username"
            fluid
            class="rounded-lg focus:shadow-[2px_2px_0_#22d3ee,-2px_2px_0_#22d3ee,2px_-2px_0_#22d3ee,-2px_-2px_0_#22d3ee]"
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple" class="mt-1">{{ $field.error?.message }}</Message>
        </FormField>

        <Button type="submit" severity="primary" label="Chat Sekarang" class="rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 mt-4" />
      </Form>

    </div>
  </div>
</template>

<style scoped>
/* Add any required scoped styles here */
</style>
