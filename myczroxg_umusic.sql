--
-- PostgreSQL database dump
--

\restrict e8VoFsYvzUJqx2yVnmk0QrDLCsn9j5Qd3tOTmiTda2D7xluxSMOEO2Twn6zW5MS

-- Dumped from database version 13.22
-- Dumped by pg_dump version 13.22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: albums; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.albums (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    cover_url text,
    artist_id uuid,
    release_year integer,
    genre_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    info text
);


ALTER TABLE public.albums OWNER TO myczroxg;

--
-- Name: artists; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.artists (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    bio text,
    image_url text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.artists OWNER TO myczroxg;

--
-- Name: favorite_album; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.favorite_album (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    album_id uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.favorite_album OWNER TO myczroxg;

--
-- Name: following; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.following (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid DEFAULT gen_random_uuid(),
    artist_id uuid DEFAULT gen_random_uuid()
);


ALTER TABLE public.following OWNER TO myczroxg;

--
-- Name: following_id_seq; Type: SEQUENCE; Schema: public; Owner: myczroxg
--

ALTER TABLE public.following ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.following_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: genres; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.genres (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    description text
);


ALTER TABLE public.genres OWNER TO myczroxg;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    song_id uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.likes OWNER TO myczroxg;

--
-- Name: playlist_songs; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.playlist_songs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    playlist_id uuid,
    song_id uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.playlist_songs OWNER TO myczroxg;

--
-- Name: playlists; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.playlists (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    image_url text,
    user_id uuid,
    is_public boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.playlists OWNER TO myczroxg;

--
-- Name: songs; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.songs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    audio_url text NOT NULL,
    cover_url text,
    album_id uuid,
    artist_id uuid,
    duration integer,
    genre_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    plays integer,
    track_no smallint
);


ALTER TABLE public.songs OWNER TO myczroxg;

--
-- Name: users; Type: TABLE; Schema: public; Owner: myczroxg
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fullname text,
    email text NOT NULL,
    avatar_url text,
    is_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    password text
);


ALTER TABLE public.users OWNER TO myczroxg;

--
-- Data for Name: albums; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.albums VALUES ('0354cd6a-13ef-4365-b7c9-838e0a5abdf4', 'Captain', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/albums/1753016758548-IMG_3895.jpeg', '5b0fee2a-a914-4d3b-be26-13d131475821', 2025, '63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-07-20 13:06:00.861858', 'With Captain, BNXN takes the wheel. The Nigerian singer-songwriter has always blurred the lines between afrobeats, R&B, and soulful introspection—but this time, he’s driving with full control, no co-pilot.
The album marks a defining moment for BNXN (pronounced "Benson"): a confident, fully-formed statement from an artist who’s learned to trust his instincts, sharpen his pen, and follow his own creative compass.
From the cinematic opener to the late-night confessionals tucked between glossy hooks, Captain feels like a diary written at cruising altitude. BNXN threads personal stories through rich instrumentation—balancing Yoruba and English lyrics, weaving between amapiano pulses, stripped-down ballads, and smoky alt-R&B.
Standout moments find him unpacking fame’s isolations, questioning loyalty, and wrestling with what it means to lead without losing yourself. There’s growth in every verse, not just in what he says, but how he says it: sharper, more intentional, and wholly unafraid to take Risks. This is BNXN unfiltered—charting new territory without ever losing sight of home.
');
INSERT INTO public.albums VALUES ('5cbfd8b3-98da-49e1-accf-5eb4f3ca7368', 'Morayo', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/albums/1749666938627-morayo.jpg', '26773854-3303-4a25-91d7-0cc7b0dbe14f', 2024, '63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-06-11 18:35:42.458759', 'Morayo is the sixth studio album by Nigerian singer Wizkid. It was released on 22 November 2024 through RCA Records and Starboy Entertainment. The album features guest appearances from Asake, Anaïs Cardot, Brent Faiyaz, Jazmine Sullivan, and Tiakola. Production was primarily handled by P2J, with contributions from others. The album was promoted by two singles, "Piece of My Heart" with Brent Faiyaz and "Kese (Dance)".

The album''s title and cover are dedicated to Wizkid''s mother Jane Balogun, who passed away in London in August 2023. Morayo is the middle name of his mother, Juliana Morayo Balogun, and is the Yoruba word for "I see joy". The album cover is a cropped image of his mother.');
INSERT INTO public.albums VALUES ('8b90547e-2429-4fdd-a7ba-9baabc1fbbb9', 'Hero', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/albums/1749667593937-hero.jpg', '09c4c3a5-68b2-4bd6-8527-ba0ef7273691', 2005, '434ad70c-04ee-46a8-8661-2fa3eb5c1a83', '2025-06-11 18:46:37.661271', 'Hero is the eighth album by Kirk Franklin, released October 4, 2005 on GospoCentric Records. Hero was certified as Gold by the Recording Industry Association of America (RIAA) on December 2, 2005 and Platinum on December 14, 2006. it is one of the best-selling gospel albums of all time. In 2007, Hero won the Grammy Award for Best Contemporary Soul Gospel Album and "Imagine Me" won the Grammy Award for Best Gospel Song.');
INSERT INTO public.albums VALUES ('948f47d2-8c42-4ab3-80f4-089fe8b2ea51', '5ive', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/albums/1749668553429-5ive.jpg', '610a42b5-b5ea-4c20-a3b0-dedfa5736291', 2025, '63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-06-11 19:02:38.094187', 'Nigerian music powerhouse Davido has officially unveiled his fifth studio album, 5IVE, a highly anticipated project that promises to showcase his growth and evolution as an artist. Released on April 18, 2025, 5IVE marks a significant step forward for the Afrobeats superstar, following the success of his previous album, Timeless.

The album features an exciting mix of collaborations with both global and African artists, including international superstars Chris Brown, Victoria Monét, and Becky G, alongside Afrobeats favorites like Omah Lay and Victony. Rising talents such as YG Marley, Odumodublvck, and Chike also make appearances, adding fresh energy to the project.

Davido’s journey to create 5IVE was an intensely personal one. He initially recorded over 80 songs before carefully selecting 17 tracks that best represent his story and growth. The album’s title, 5IVE, is deeply meaningful to Davido, symbolizing hope, transformation, and his personal evolution. The project touches on themes of resilience, love, and recovery, particularly following the tragic loss of his son in 2022 and the joyful arrival of his twins.

For fans eager to experience the new music live, Davido has announced the 5IVE Stops tour, a five-city series of exclusive performances in New York, Atlanta, Los Angeles, London, and Paris. These intimate events will give fans an early chance to hear the album before its official release.

With 5IVE, Davido once again proves his place as a leader in the global music scene, blending personal stories with infectious beats that are sure to resonate with listeners worldwide.');
INSERT INTO public.albums VALUES ('9834c711-e304-426a-995d-d74e4a0a778a', 'DAMN', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/albums/kendrick-lamar-love.jpg', 'fb0ec2c3-6e42-4790-9c08-fe71146c0c96', 2017, '78b36bb7-5b24-4ba2-86ae-eed1f3cd7ccb', '2025-06-06 23:05:23', NULL);
INSERT INTO public.albums VALUES ('ba7158c6-9939-4f14-b3a8-ee480308db11', 'Sweetener', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/albums/1749588218886-ariana-grande-god-is-a-woman.jpg', '5ac859fe-a957-4ea9-a42d-41f2c768f1ab', 2018, '14581333-0430-4288-a900-8a36d42787ba', '2025-06-10 20:43:41.431634', NULL);


--
-- Data for Name: artists; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.artists VALUES ('09c4c3a5-68b2-4bd6-8527-ba0ef7273691', 'Kirk Franklin', 'Gospel singer and choir leader; b. Jan 26, 1970 in Fort Worth, TX. The world was first introduced to Franklin in 1993 with his self-titled debut, Kirk Franklin & the Family. Widely accepted and embraced by the masses, it went on to spend 100 weeks at the top of Billboard magazine''s gospel charts.', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/artists/1749667286974-Kirk.jpg', '2025-06-11 18:41:30.4021');
INSERT INTO public.artists VALUES ('26773854-3303-4a25-91d7-0cc7b0dbe14f', 'Wizkid', 'Ayodeji Ibrahim Balogun (born 16 July 1990), better known as Wizkid, is a Nigerian singer and songwriter. Born in the Ojuelegba suburb of Surulere, Lagos, Wizkid is a voice in the emerging Afrobeats movement. His music is a blend of Afrobeats, afropop, R&B, afrobeat, reggae, dancehall, and pop. He began recording music at the age of 11 and released a collaborative album with the Glorious Five, a group he and a couple of his church friends formed. In 2009, Wizkid signed a record deal with Banky W''s Empire Mates Entertainment (E.M.E). He rose to the limelight after releasing "Holla at Your Boy", the lead single from his debut studio album, Superstar (2011), which also spawned the singles "Tease Me/Bad Guys" and "Don''t Dull".

On 17 September 2014, he released the self-titled second studio album, Ayo, which was supported by six singles, including "Jaiye Jaiye". Wizkid left E.M.E. after his contract expired. In 2016, he achieved international recognition following his collaboration with Drake on the hit single "One Dance", which reached number-one on the US Billboard Hot 100 and topped the charts in 14 additional countries. The song broke multiple records, making Wizkid the first Afrobeats artist to appear in the Guinness World Records. In March 2017, he signed a multi-album deal with RCA Records and released his third studio album, Sounds from the Other Side, later that year. The album was supported by five singles, including "Come Closer" (featuring Drake).

In October 2020, he released his fourth album, Made in Lagos, which received commercial success and acclaim reaching number-one on the Billboard World Album Chart. The album includes the single "Essence" featuring Tems, which became the first Nigerian song to chart on the Billboard Hot 100, and reached the top ten following a remix released by Justin Bieber. Wizkid''s fifth album, More Love, Less Ego, was released on 11 November 2022. His sixth album Morayo, which is dedicated to his late mother, was released on 22 November 2024. The album broke the record for the biggest streaming debut for an African album on Spotify.[18][19]', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/artists/1749666687777-wiz.jpeg', '2025-06-11 18:31:32.677082');
INSERT INTO public.artists VALUES ('5ac859fe-a957-4ea9-a42d-41f2c768f1ab', 'Ariana Grande', 'Ariana Grande was born June 26, 1993. She is an American singer, songwriter, and actress. Regarded as a pop icon and an influential figure in popular music, Grande is known for her four-octave vocal range, which extends into the whistle register. Her accolades include two Grammy Awards, a Brit Award, two Billboard Music Awards, three American Music Awards, and ten MTV Video Music Awards. The world''s highest-paid female musician in 2020, Grande has sold over 90 million records worldwide, making her one of the best-selling music artists of all time.

Grande began her career as a teenage actress by appearing in the Broadway musical 13 (2008), and rose to fame as Cat Valentine in the Nickelodeon television series Victorious (2010–2013) and its spin-off series Sam & Cat (2013–2014). She signed with Republic Records and released her retro-pop and R&B-influenced debut studio album, Yours Truly (2013), which debuted at number one on the Billboard 200. Grande blended pop, R&B, and electronic on her second and third albums, My Everything (2014) and Dangerous Woman (2016), which contained the internationally successful singles "Problem", "Break Free", "Bang Bang", "One Last Time", "Into You" and "Side to Side".

Personal struggles influenced Grande''s trap-infused albums Sweetener (2018) and Thank U, Next (2019). The former won Grande her first Grammy award, while the latter garnered US number-one singles "Thank U, Next" and "7 Rings", and made her the first solo artist to occupy the top three spots of the Billboard Hot 100. She subsequently achieved the most number-one debuts in Hot 100 chart history with the title track of her sixth album, Positions (2020), as well as the collaborations "Stuck with U", "Rain on Me", "Save Your Tears" and "Die for You". After a musical hiatus, Grande released her seventh album, Eternal Sunshine (2024), which yielded the US number-one singles "Yes, And?" and "We Can''t Be Friends (Wait for Your Love)". She returned to film acting with the political satire Don''t Look Up (2021) and received critical praise for her portrayal of Glinda in the fantasy musical Wicked (2024), earning her a nomination for the Academy Award for Best Supporting Actress.

Grande has six Billboard 200 number-one albums and nine Billboard Hot 100 number-one singles, with the most number-one duets in the US. She has been listed amongst history''s greatest artists and vocalists by publications such as Rolling Stone and Billboard. Grande featured on the Time 100 in 2016 and 2019, and the Forbes Celebrity 100 in 2019 and 2020. Outside of music and acting, she has worked with many charitable organizations and advocates for animal rights, mental health, and gender, racial, and LGBT equality. Her business ventures include R.E.M. Beauty, a cosmetics brand launched in 2021, and a fragrance line that has earned over $1 billion in global retail sales. She has a large social media following, being the sixth-most-followed individual on Instagram.', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/artists/1749587995629-ari.avif', '2025-06-10 20:39:58.840381');
INSERT INTO public.artists VALUES ('5b0fee2a-a914-4d3b-be26-13d131475821', 'BNXN', 'Daniel Etiese Benson (born 14 May 1997), known professionally as Bnxn (pronounced as Benson) and formerly known as Buju, is a Nigerian Afro-fusion singer, songwriter and record producer. Born in Lagos, Nigeria.', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/artists/1753015269650-IMG_3894.jpeg', '2025-07-20 12:41:11.511734');
INSERT INTO public.artists VALUES ('610a42b5-b5ea-4c20-a3b0-dedfa5736291', 'Davido', 'David Adedeji Adeleke (born November 21, 1992), better known by his stage name Davido, is an American-born Nigerian recording artist, performer and record producer. His 2011 single "Dami Duro" was well-received throughout Nigeria. Along with his elder brother Adewale Adeleke, Davido is the co-owner of HKN Music (a record label home to Sina Rambo, B. Red and DeeKay). He has produced songs for Naeto C, Skales, Tiwa Savage and Sauce Kid. In April 2012, he signed an endorsement deal with MTN Nigeria. On October 23, 2013, Davido partnered with Guinness Nigeria for the "Guinness World of More" concert,he is the owner of DMW', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/artists/1749668283323-davido.jpg', '2025-06-11 18:58:07.277929');
INSERT INTO public.artists VALUES ('fb0ec2c3-6e42-4790-9c08-fe71146c0c96', 'Kendrick Lamar', 'Kendrick Lamar Duckworth (born June 17, 1987) is an American rapper and songwriter. He is regarded as one of the most influential hip hop artists of his generation and is known for his technical artistry and complex songwriting. Lamar started his musical journey as a teenager, recording mixtapes under the pseudonym K-Dot, and signed his first musical contract at the age of sixteen with record label Top Dawg Entertainment.', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/artists/kdot.jpeg', '2025-06-06 23:00:49');


--
-- Data for Name: favorite_album; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.favorite_album VALUES ('8f1da3fc-0f4b-48bf-8c3d-6b6c6400d62c', '4e4d5e78-a83b-4e8e-bdd9-1eb208088d7e', '948f47d2-8c42-4ab3-80f4-089fe8b2ea51', '2025-06-25 20:47:11.58779');
INSERT INTO public.favorite_album VALUES ('a48b35f0-7742-4fa5-9437-bf89bf5fb17f', '6dc05e60-b9e0-42e2-9de9-3dc279e4e715', '948f47d2-8c42-4ab3-80f4-089fe8b2ea51', '2025-07-22 19:43:32.609389');


--
-- Data for Name: following; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.following OVERRIDING SYSTEM VALUE VALUES (4, '2025-06-25 20:32:08.757036+00', '4e4d5e78-a83b-4e8e-bdd9-1eb208088d7e', '26773854-3303-4a25-91d7-0cc7b0dbe14f');
INSERT INTO public.following OVERRIDING SYSTEM VALUE VALUES (5, '2025-06-25 20:33:24.892156+00', '4e4d5e78-a83b-4e8e-bdd9-1eb208088d7e', '610a42b5-b5ea-4c20-a3b0-dedfa5736291');
INSERT INTO public.following OVERRIDING SYSTEM VALUE VALUES (6, '2025-07-22 19:42:47.742397+00', '6dc05e60-b9e0-42e2-9de9-3dc279e4e715', '5b0fee2a-a914-4d3b-be26-13d131475821');
INSERT INTO public.following OVERRIDING SYSTEM VALUE VALUES (7, '2025-07-22 19:43:20.192857+00', '6dc05e60-b9e0-42e2-9de9-3dc279e4e715', '26773854-3303-4a25-91d7-0cc7b0dbe14f');


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.genres VALUES ('0e58f4ec-029b-4cc9-9f34-a375ca82a19d', '2025-06-11 18:20:32.209663+00', 'Amapiano', 'Amapiano is a subgenre of House music that blends sounds of Deep House, jazz, and lounge music with a South African flavor.

The genre, which translates to “the pianos” in Zulu, emerged in the early 2010s. Tracks usually incorporate African rhythms, instruments, and chants, but with a backbeat familiar to House lovers.');
INSERT INTO public.genres VALUES ('14581333-0430-4288-a900-8a36d42787ba', '2025-06-09 17:52:11+00', 'Pop', 'Pop music is a genre of popular music that originated in its modern form during the mid-1950s in the United States and the United Kingdom.[3] During the 1950s and 1960s, pop music encompassed rock and roll and the youth-oriented styles it influenced. Rock and pop music remained roughly synonymous until the late 1960s, after which pop became associated with music that was more commercial, ephemeral, and accessible.');
INSERT INTO public.genres VALUES ('434ad70c-04ee-46a8-8661-2fa3eb5c1a83', '2025-06-11 18:44:30.051694+00', 'Gospel', 'Gospel Music is a genre in and of itself, that crosses style boundaries. Various selections may be based on Country, Bluegrass, Hip Hop, Classical, Urban Contemporary, and even Jazz. The common denominator throughout is the focus on the Christian belief system. Various song themes come from Biblical concepts, with Jesus Christ, through the Holy Spirit, as the principle guide for one''s life.

The songs themselves are considered to provide inspiration, instruction, strength and peace to the listener that may or may not have accepted the Christian belief system for themselves.');
INSERT INTO public.genres VALUES ('63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-06-11 18:18:35.466896+00', 'Funk / Soul', 'Funk is a music genre that originated in African-American communities in the mid-1960s when musicians created a rhythmic, danceable new form of music through a mixture of various music genres that were popular among African-Americans in the mid-20th century. It deemphasizes melody and chord progressions and focuses on a strong rhythmic groove of a bassline played by an electric bassist and a drum part played by a percussionist, often at slower tempos than other popular music. Funk typically consists of a complex percussive groove with rhythm instruments playing interlocking grooves that create a "hypnotic" and "danceable" feel.[3] It uses the same richly colored extended chords found in bebop jazz, such as minor chords with added sevenths and elevenths, and dominant seventh chords with altered ninths and thirteenth.

Soul music is a popular music genre that originated in African-American communities throughout the United States in the late 1950s and early 1960s.[2] Catchy rhythms, stressed by handclaps and extemporaneous body movements, are an important hallmark of soul. Other characteristics are a call and response between the lead and backing vocalists, an especially tense vocal sound, and occasional improvisational additions, twirls, and auxiliary sounds.[3] Soul music is known for reflecting African-American identity and stressing the importance of African-American culture.');
INSERT INTO public.genres VALUES ('78b36bb7-5b24-4ba2-86ae-eed1f3cd7ccb', '2025-06-09 17:47:42+00', 'Rap', 'Rap music is one of the most popular music genres in the world. Although it officially began in the early 1970s, the concept of Rap music has been around since prehistoric times, performed by West Africa’s griots – musicians, storytellers, or oral historians who preserve historical narratives, oral traditions, and genealogies.');
INSERT INTO public.genres VALUES ('7a3793d5-60ce-4b3f-a9b4-d306b386872d', '2025-06-11 18:26:57.781188+00', 'Reggae', 'Reggae is a music genre that originated in Jamaica during the late 1960s. The term also denotes the modern popular music of Jamaica and its diaspora. A 1968 single by Toots and the Maytals, "Do the Reggay", was the first popular song to use the word reggae, effectively naming the genre and introducing it to a global audience. Reggae is rooted in traditional Jamaican Kumina, Pukkumina, Revival Zion, Nyabinghi, and burru drumming. Jamaican reggae music evolved out of the earlier genres mento, ska and rocksteady. Reggae usually relates news, social gossip, and political commentary. It is recognizable from the counterpoint between the bass and drum downbeat and the offbeat rhythm section. The immediate origins of reggae were in ska and rocksteady; from the latter, reggae took over the use of the bass as a percussion instrument.');
INSERT INTO public.genres VALUES ('9a23c1d7-c166-4f34-be4e-462943595570', '2025-06-11 18:24:49.155958+00', 'R&B / Soul', 'Rhythm and blues, frequently abbreviated as R&B or R''n''B, is a genre of popular music that originated within African American communities in the 1940s. The term was originally used by record companies to describe recordings marketed predominantly to African Americans, at a time when "rocking, jazz based music ... [with a] heavy, insistent beat" was starting to become more popular. In the commercial rhythm and blues music typical of the 1950s through the 1970s, the bands usually consisted of a piano, one or two guitars, bass, drums, one or more saxophones, and sometimes background vocalists. R&B lyrical themes often encapsulate the African-American history and experience of pain and the quest for freedom and joy, as well as triumphs and failures in terms of societal racism, oppression, relationships, economics, and aspirations.

Soul music is a popular music genre that originated in African-American communities throughout the United States in the late 1950s and early 1960s.[2] Catchy rhythms, stressed by handclaps and extemporaneous body movements, are an important hallmark of soul. Other characteristics are a call and response between the lead and backing vocalists, an especially tense vocal sound, and occasional improvisational additions, twirls, and auxiliary sounds.[3] Soul music is known for reflecting African-American identity and stressing the importance of African-American culture.');
INSERT INTO public.genres VALUES ('9bba5852-60a5-409e-a59e-a38b174efd8d', '2025-06-09 17:49:40+00', 'Blues', 'The blues is a form of secular folk music created by African Americans in the early 20th century, originally in the South. Although instrumental accompaniment is almost universal in the blues, the blues is essentially a vocal form. Blues songs are usually lyrical rather than narrative because the expression of feelings is foremost.');


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.likes VALUES ('7904ae9a-bf54-45fc-9d29-cb02f4b4a8bb', '4e4d5e78-a83b-4e8e-bdd9-1eb208088d7e', 'a4c229af-e0f8-4ce7-bb1c-e4cb5b17d789', '2025-07-01 20:36:07.534128');
INSERT INTO public.likes VALUES ('dff4d307-d34c-4eee-8e5f-84c2b02ae38c', '4e4d5e78-a83b-4e8e-bdd9-1eb208088d7e', '9ec7c771-c69a-4fb0-bc9e-7541b333e1f7', '2025-07-01 20:37:08.362379');


--
-- Data for Name: playlist_songs; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.playlist_songs VALUES ('4cc70fb0-8d6a-49cb-baaa-5c6c96119d24', '151e71bc-cb3f-4078-824d-c21a5918706e', '132ec159-9f98-45c0-ba07-77f388ddfc90', '2025-06-17 16:29:49.30374');
INSERT INTO public.playlist_songs VALUES ('63032024-ca17-46b2-a31f-8963fff78805', 'ba7faaf4-808c-44e8-a355-037d2f2f5a25', '9ec7c771-c69a-4fb0-bc9e-7541b333e1f7', '2025-07-01 21:50:09.051958');
INSERT INTO public.playlist_songs VALUES ('6cae49f2-75d4-4130-a8a4-82f608c43d7c', '151e71bc-cb3f-4078-824d-c21a5918706e', '013f9a78-bf18-4cb5-9b03-482041d46374', '2025-06-17 16:21:32.241954');
INSERT INTO public.playlist_songs VALUES ('85fb2dd3-3381-4355-a9db-829d938039c7', 'ba7faaf4-808c-44e8-a355-037d2f2f5a25', '93cba0e9-85fa-4d10-860f-cfcc87fddada', '2025-06-20 20:38:21.770656');
INSERT INTO public.playlist_songs VALUES ('c48564e9-c34c-4de6-a91d-ec012b19e104', 'ba7faaf4-808c-44e8-a355-037d2f2f5a25', 'a4c229af-e0f8-4ce7-bb1c-e4cb5b17d789', '2025-06-20 20:37:34.046947');
INSERT INTO public.playlist_songs VALUES ('d00c9394-67cf-4039-bfac-d57b04f9d689', 'ba7faaf4-808c-44e8-a355-037d2f2f5a25', '3e690b83-607f-4bc0-b2cd-141bf6b5527e', '2025-06-20 20:37:25.596184');
INSERT INTO public.playlist_songs VALUES ('f8692203-4ce0-4996-90a8-c59bbe50201f', '151e71bc-cb3f-4078-824d-c21a5918706e', '5c985680-78e1-4590-8f28-b61582ade4b7', '2025-06-17 16:21:42.211939');


--
-- Data for Name: playlists; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.playlists VALUES ('151e71bc-cb3f-4078-824d-c21a5918706e', 'Amapiano', 'Amapiano is a Way of Life', NULL, '4e4d5e78-a83b-4e8e-bdd9-1eb208088d7e', true, '2025-06-17 16:21:28.417833');
INSERT INTO public.playlists VALUES ('ba7faaf4-808c-44e8-a355-037d2f2f5a25', 'Gentle', NULL, NULL, '4e4d5e78-a83b-4e8e-bdd9-1eb208088d7e', true, '2025-06-20 20:37:14.169202');


--
-- Data for Name: songs; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.songs VALUES ('013f9a78-bf18-4cb5-9b03-482041d46374', 'Be There Still', 'hve2p0keepbc7dpvup1d9wvho.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1749668654347-5ive.jpg', '948f47d2-8c42-4ab3-80f4-089fe8b2ea51', '610a42b5-b5ea-4c20-a3b0-dedfa5736291', 195, '0e58f4ec-029b-4cc9-9f34-a375ca82a19d', '2025-06-11 19:04:18.124007', 89, 3);
INSERT INTO public.songs VALUES ('0665084e-c442-449b-93ce-13b208e95da4', 'Captain', 'uql6ft5qztypfsp933lylpicz.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017515905-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 202, '63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-07-20 13:18:37.375518', NULL, 7);
INSERT INTO public.songs VALUES ('122755b8-183a-4a12-a4f7-395812f3adc4', 'Yes Sir', 'up6zwbtre3mfyjeo7b3d0wb2w.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017694831-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 173, '63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-07-20 13:21:36.354643', 1, 8);
INSERT INTO public.songs VALUES ('132ec159-9f98-45c0-ba07-77f388ddfc90', 'With You (feat. Omah Lay)', 's4svopjcrigjaed58mwx6kre9', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1750111028293-1749668654347-5ive.jpg', '948f47d2-8c42-4ab3-80f4-089fe8b2ea51', '610a42b5-b5ea-4c20-a3b0-dedfa5736291', 136, '0e58f4ec-029b-4cc9-9f34-a375ca82a19d', '2025-06-17 13:56:24.194926', 237, 17);
INSERT INTO public.songs VALUES ('3489aa4f-8489-48a3-9d4d-bae0e1ab4842', 'Cutesy', 'hhys7c806t5w9zh6nmoq0pu25.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017359486-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 182, '9a23c1d7-c166-4f34-be4e-462943595570', '2025-07-20 13:16:00.726641', NULL, 3);
INSERT INTO public.songs VALUES ('385b47ec-0a33-4797-8cfe-2fbd7578abb8', 'In Jesus Name', 'gewp5ehwp1g08rs1hn8fm9ecn.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017865650-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 243, '434ad70c-04ee-46a8-8661-2fa3eb5c1a83', '2025-07-20 13:24:26.988647', 6, 16);
INSERT INTO public.songs VALUES ('3b9f8a92-3dcc-48dd-a645-6b204349ab43', 'DNA', 'stausdixaww51eyny77iu0frb..m4a', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1752839224935-kendrick-lamar-love.jpg', '9834c711-e304-426a-995d-d74e4a0a778a', 'fb0ec2c3-6e42-4790-9c08-fe71146c0c96', 186, '78b36bb7-5b24-4ba2-86ae-eed1f3cd7ccb', '2025-07-18 11:47:06.259841', 34, 2);
INSERT INTO public.songs VALUES ('3e690b83-607f-4bc0-b2cd-141bf6b5527e', 'Après Minuit', 's840i1cfrc6cljdc9qw77jpvg.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1749667054393-morayo.jpg', '5cbfd8b3-98da-49e1-accf-5eb4f3ca7368', '26773854-3303-4a25-91d7-0cc7b0dbe14f', 177, '9a23c1d7-c166-4f34-be4e-462943595570', '2025-06-11 18:37:38.160548', 21, 10);
INSERT INTO public.songs VALUES ('457180db-4bc2-40b0-be63-16800a849005', 'Eleyi', 'uje0d6tpw923j7jf4ynd41mhd.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017573303-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 143, '63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-07-20 13:19:37.145197', 1, 6);
INSERT INTO public.songs VALUES ('5c985680-78e1-4590-8f28-b61582ade4b7', 'Soji', 'xpo2xyjyumjgwo0ece45rxvxo.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1750110918873-1749667054393-morayo.jpg', '5cbfd8b3-98da-49e1-accf-5eb4f3ca7368', '26773854-3303-4a25-91d7-0cc7b0dbe14f', 159, '63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-06-17 13:54:32.219463', 44, 12);
INSERT INTO public.songs VALUES ('7f396760-2e8c-4d06-b92f-4a4c78fac616', 'Fi Kan We Kan (Feat. Rema)', 'tujvufilsz9zqgof1m4q8ejtd.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017800489-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 159, '0e58f4ec-029b-4cc9-9f34-a375ca82a19d', '2025-07-20 13:23:21.851457', 7, 12);
INSERT INTO public.songs VALUES ('8c9f47db-1b52-45d3-acf9-7c1cf9af8de7', 'LOYALTY', 't3cs5c8ghcrtc7o98210mrbsb', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1752836909718-kendrick-lamar-love.jpg', '9834c711-e304-426a-995d-d74e4a0a778a', 'fb0ec2c3-6e42-4790-9c08-fe71146c0c96', 227, '78b36bb7-5b24-4ba2-86ae-eed1f3cd7ccb', '2025-07-18 11:08:31.974953', 4, 6);
INSERT INTO public.songs VALUES ('8dab5c92-9e80-44f7-89a7-ae9f85c07390', 'Totori', 'iq653cq160lsiwbjq9nk651sp.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017640269-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 198, '63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-07-20 13:20:41.578987', 2, 13);
INSERT INTO public.songs VALUES ('8ebbd786-ace9-49a4-8920-7c5046c21f1e', 'I Alone', 'zitbt3w2swyo99b0ebq7q1c3s.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017184811-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 207, '9bba5852-60a5-409e-a59e-a38b174efd8d', '2025-07-20 13:13:07.300235', 4, 1);
INSERT INTO public.songs VALUES ('93cba0e9-85fa-4d10-860f-cfcc87fddada', 'Imagine Me', 'nrwj06dt52e1b96y8oy7rmxn3.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1749667686744-hero.jpg', '8b90547e-2429-4fdd-a7ba-9baabc1fbbb9', '09c4c3a5-68b2-4bd6-8527-ba0ef7273691', 333, '434ad70c-04ee-46a8-8661-2fa3eb5c1a83', '2025-06-11 18:48:10.486224', 34, 7);
INSERT INTO public.songs VALUES ('9ec7c771-c69a-4fb0-bc9e-7541b333e1f7', 'God is a Woman', 'eeiwwmns7oc84x17adkpwfmqz.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1749588347324-ariana-grande-god-is-a-woman.jpg', 'ba7158c6-9939-4f14-b3a8-ee480308db11', '5ac859fe-a957-4ea9-a42d-41f2c768f1ab', 197, '14581333-0430-4288-a900-8a36d42787ba', '2025-06-10 20:45:49.931609', 31, 5);
INSERT INTO public.songs VALUES ('a4c229af-e0f8-4ce7-bb1c-e4cb5b17d789', 'LOVE. (feat. Zacari)', 'czi8153v4nnt7isbtrsn7t8mb.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1749254175580-kendrick-lamar-love.jpg', '9834c711-e304-426a-995d-d74e4a0a778a', 'fb0ec2c3-6e42-4790-9c08-fe71146c0c96', 211, '78b36bb7-5b24-4ba2-86ae-eed1f3cd7ccb', '2025-06-06 23:56:19.061104', 33, 10);
INSERT INTO public.songs VALUES ('a66e2282-9960-476c-a734-7701969f819f', 'Cough Syrup (Feat. Victony)', 'uu52z0cwta7ggpee9of9mn9j4.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017937587-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 191, '63ad8c58-f5f6-45ff-894d-a15e499a459f', '2025-07-20 13:25:39.193417', 103, 15);
INSERT INTO public.songs VALUES ('ebd7bb7e-8ea6-4673-96ad-467a3eef7475', 'Ashimolowo', 'ie9zfsvrtgoat6qy4j5eblge9.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1753017440275-1753016758548-IMG_3895.jpeg', '0354cd6a-13ef-4365-b7c9-838e0a5abdf4', '5b0fee2a-a914-4d3b-be26-13d131475821', 188, '9bba5852-60a5-409e-a59e-a38b174efd8d', '2025-07-20 13:17:21.856167', 1, 14);
INSERT INTO public.songs VALUES ('f61f0fc6-36fa-411d-a603-5c673e9401fd', 'Bad Girl (feat. Asake)', 'k2jrdzgovhrkhbxz2jeyop1yq.mp3', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/covers/1750110810368-1749667054393-morayo.jpg', '5cbfd8b3-98da-49e1-accf-5eb4f3ca7368', '26773854-3303-4a25-91d7-0cc7b0dbe14f', 174, '0e58f4ec-029b-4cc9-9f34-a375ca82a19d', '2025-06-17 13:52:43.888364', 43, 4);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: myczroxg
--

INSERT INTO public.users VALUES ('4e4d5e78-a83b-4e8e-bdd9-1eb208088d7e', 'David Utibe Jonah', 'dutibe04@gmail.com', 'https://pnlrwlplfsxmtfwejjga.supabase.co/storage/v1/object/public/media/avatars/1750871304970-me.jpg', true, '2025-06-06 13:49:54.584827', '123456789');
INSERT INTO public.users VALUES ('6dc05e60-b9e0-42e2-9de9-3dc279e4e715', 'David Jonah', 'djonah04@gmail.com', NULL, false, '2025-06-06 14:11:02.929203', NULL);


--
-- Name: following_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myczroxg
--

SELECT pg_catalog.setval('public.following_id_seq', 1, false);


--
-- Name: albums albums_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_pkey PRIMARY KEY (id);


--
-- Name: artists artists_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT artists_pkey PRIMARY KEY (id);


--
-- Name: favorite_album favorite_album_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.favorite_album
    ADD CONSTRAINT favorite_album_pkey PRIMARY KEY (id);


--
-- Name: following following_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.following
    ADD CONSTRAINT following_pkey PRIMARY KEY (id);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: playlist_songs playlist_songs_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.playlist_songs
    ADD CONSTRAINT playlist_songs_pkey PRIMARY KEY (id);


--
-- Name: playlists playlists_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.playlists
    ADD CONSTRAINT playlists_pkey PRIMARY KEY (id);


--
-- Name: songs songs_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: albums albums_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id);


--
-- Name: albums albums_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id);


--
-- Name: favorite_album favorites_album_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.favorite_album
    ADD CONSTRAINT favorites_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums(id);


--
-- Name: favorite_album favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.favorite_album
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: following following_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.following
    ADD CONSTRAINT following_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id);


--
-- Name: following following_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.following
    ADD CONSTRAINT following_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: likes likes_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs(id);


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: playlist_songs playlist_songs_playlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.playlist_songs
    ADD CONSTRAINT playlist_songs_playlist_id_fkey FOREIGN KEY (playlist_id) REFERENCES public.playlists(id);


--
-- Name: playlist_songs playlist_songs_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.playlist_songs
    ADD CONSTRAINT playlist_songs_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs(id);


--
-- Name: playlists playlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.playlists
    ADD CONSTRAINT playlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: songs songs_album_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums(id);


--
-- Name: songs songs_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id);


--
-- Name: songs songs_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myczroxg
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id);


--
-- PostgreSQL database dump complete
--

\unrestrict e8VoFsYvzUJqx2yVnmk0QrDLCsn9j5Qd3tOTmiTda2D7xluxSMOEO2Twn6zW5MS
