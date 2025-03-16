const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_API_KEY, SUPABASE_PROJECT_URL, NODE_ENV } = require('../env');

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_KEY);
const imageBucket = NODE_ENV === 'production' ? 'images-prod' : 'images-dev';

module.exports = { supabase, imageBucket };
