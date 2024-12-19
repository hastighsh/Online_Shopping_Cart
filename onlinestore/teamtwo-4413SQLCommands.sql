--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 16.6

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

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Address" (
    id integer NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    "postalCode" text NOT NULL,
    country text NOT NULL,
    province text NOT NULL
);


ALTER TABLE public."Address" OWNER TO postgres;

--
-- Name: Address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Address_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Address_id_seq" OWNER TO postgres;

--
-- Name: Address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Address_id_seq" OWNED BY public."Address".id;


--
-- Name: CreditCardInfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CreditCardInfo" (
    id integer NOT NULL,
    "cardHolder" text NOT NULL,
    "cardLast4" text NOT NULL,
    "cardType" text NOT NULL,
    expiration timestamp(3) without time zone NOT NULL,
    "billingAddressId" integer NOT NULL
);


ALTER TABLE public."CreditCardInfo" OWNER TO postgres;

--
-- Name: CreditCardInfo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CreditCardInfo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CreditCardInfo_id_seq" OWNER TO postgres;

--
-- Name: CreditCardInfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CreditCardInfo_id_seq" OWNED BY public."CreditCardInfo".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "shippingAddressId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_id_seq" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    category text,
    image text DEFAULT 'delete'::text NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: ProductItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductItem" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    "orderId" integer
);


ALTER TABLE public."ProductItem" OWNER TO postgres;

--
-- Name: ProductItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProductItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProductItem_id_seq" OWNER TO postgres;

--
-- Name: ProductItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProductItem_id_seq" OWNED BY public."ProductItem".id;


--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Product_id_seq" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    username text NOT NULL,
    "creditCardId" integer,
    "shippingAddressId" integer,
    "isAdmin" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: Address id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address" ALTER COLUMN id SET DEFAULT nextval('public."Address_id_seq"'::regclass);


--
-- Name: CreditCardInfo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreditCardInfo" ALTER COLUMN id SET DEFAULT nextval('public."CreditCardInfo_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: ProductItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductItem" ALTER COLUMN id SET DEFAULT nextval('public."ProductItem_id_seq"'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Address" (id, street, city, "postalCode", country, province) FROM stdin;
2	31 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
3	31 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
4	31 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
1	32 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
5	33 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
6	32 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
7	32 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
8	32 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
9	32 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
10	37 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
11	37 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
12	32 Vespucci Drive	Vaughan	L6A2T9	Canada	Ontario
13	17 Vespucci Drive	Vaughan	L6A2T9	Canada	Ontario
14	31 Vespucci Drive	Vaughan	L6A2T9	Canada	Ontario
15	49 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
16	71 Vespucci Drive	Vaughan	L6A 2T9	Canada	Ontario
\.


--
-- Data for Name: CreditCardInfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CreditCardInfo" (id, "cardHolder", "cardLast4", "cardType", expiration, "billingAddressId") FROM stdin;
1	Jacob Abarrota	4649	Visa	2025-04-11 00:00:00	1
3	Jacob Abarrota	1234	Visa	2025-01-31 00:00:00	4
2	Jacob Abarrota	4444444444444444	Mastercard	2025-01-15 00:00:00	1
4	Jacob Abarrota	4444444444444444	Mastercard	2025-01-15 00:00:00	5
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "userId", status, "createdAt", "updatedAt", "shippingAddressId") FROM stdin;
1	2	Pending	2024-11-24 19:59:37.035	2024-11-24 19:59:37.035	1
3	2	Pending	2024-11-25 09:21:53.661	2024-11-25 09:21:53.661	1
4	2	Pending	2024-11-25 09:24:25.024	2024-11-25 09:24:25.024	1
5	2	Pending	2024-11-25 09:33:17.407	2024-11-25 09:33:17.407	1
6	2	Pending	2024-11-25 09:37:03.875	2024-11-25 09:37:03.875	1
7	2	Pending	2024-11-25 09:37:48.79	2024-11-25 09:37:48.79	1
8	2	Pending	2024-11-25 09:41:25.563	2024-11-25 09:41:25.563	1
9	2	Pending	2024-11-25 09:46:13.649	2024-11-25 09:46:13.649	1
10	2	Pending	2024-11-25 09:46:50.124	2024-11-25 09:46:50.124	1
11	2	Pending	2024-11-25 09:48:25.858	2024-11-25 09:48:25.858	1
12	2	Pending	2024-11-25 09:50:06.381	2024-11-25 09:50:06.381	1
13	2	Pending	2024-11-25 09:54:12.372	2024-11-25 09:54:12.372	1
14	2	Pending	2024-11-25 09:54:44.067	2024-11-25 09:54:44.067	1
15	2	Pending	2024-11-25 09:56:45.93	2024-11-25 09:56:45.93	1
16	2	Pending	2024-11-25 21:54:59.103	2024-11-25 21:54:59.103	1
17	2	Pending	2024-11-25 22:09:56.791	2024-11-25 22:09:56.791	1
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, description, price, category, image) FROM stdin;
1	Ugly Knit Sweater	This is one ugly sweater!	50.99	Sweater	/images/KnitUglySweater.jpeg
2	Cool Brown t-shirt	Such a nice brown shirt!	51.22	Shirt	/images/t-shirt.jpeg
3	Leather wallet	Very nice leather.	74.55	Accessories	/images/leatherwallet.jpeg
5	Bracelet	Cute and handmade.	9.99	Accessories	/images/bracelet.jpeg
4	Flower Tote Bag	So pretty with flowers.	23.99	Bags and Purses	/images/cuteTotebag.jpeg
6	Earth Tote Bag	Who doesn't love the earth?	14.99	Bags and Purses	/images/earthToteBag.jpeg
7	Black purse	Small and great.	79.99	Bags and Purses	/images/purse.jpeg
8	Seasonal Sweater	Just in time for the holidays!	61.99	Sweater	/images/SeasonalSweater.jpeg
9	Raven Shirt	For all you raving ravens!	22.99	Shirt	/images/RavingRaven.jpeg
\.


--
-- Data for Name: ProductItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductItem" (id, "productId", "orderId") FROM stdin;
7	1	1
8	2	\N
9	2	1
10	2	\N
11	2	1
69	5	\N
70	5	\N
71	5	\N
74	4	\N
80	7	\N
83	8	\N
84	9	\N
85	9	\N
86	9	\N
66	3	3
67	3	4
68	3	5
78	7	6
72	4	7
75	6	8
36	2	\N
37	2	\N
76	6	9
77	6	10
79	7	11
73	4	12
81	8	13
82	8	14
63	1	15
64	1	16
65	1	17
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8564f233-6db8-4e81-a4d5-2e23ae0eb8cc	052f116823ed02f808befa77adba8464f677847b48aa568c5b0df3702f01b117	2024-11-05 17:59:17.900212-05	20241105225917_first	\N	\N	2024-11-05 17:59:17.893385-05	1
1eb9e1ee-32a7-45ae-876a-7bdd47a1f2cb	60b93ffc530404bb79dd398c10590230d1b8e3ed4d047f821bc0af059eb54ca6	2024-11-25 04:13:40.582305-05	20241125091340_orderaddress	\N	\N	2024-11-25 04:13:40.572099-05	1
a6d5c9c6-a758-497d-898d-6faad5ddfbca	c5ed90218b268daca81609b0d41e468949fffebe1b4cfc25686d2de025713be6	2024-11-05 18:06:31.954143-05	20241105230631_rename_user_table_to_users	\N	\N	2024-11-05 18:06:31.945019-05	1
fbbcb103-28f3-4063-8d01-a519d71898b0	a75838db1e50a95039fe50c99df7bf9f392bcd03aa2d7b81eafeffb888d11902	2024-11-05 18:07:54.422401-05	20241105230754_back_to_user	\N	\N	2024-11-05 18:07:54.414833-05	1
ad3b4574-0a01-487f-9244-8fec659ac82b	7d02e73df28985d2580d662fa83939c14ae8b21561658629b6a440be2314e9b8	2024-11-22 21:31:44.677298-05	20241123023144_init	\N	\N	2024-11-22 21:31:44.674167-05	1
a2512a06-8fac-4ae9-8a0a-ab54326ffa4f	0cd5ed8184da4b56706f114053873b76207399bc54708e24d3a0c20d851207d8	2024-11-22 21:44:54.424413-05	20241123024454_rename_users_table	\N	\N	2024-11-22 21:44:54.398689-05	1
a000a1d8-1827-4f9c-b4a5-3096a7ea99c6	9010cf07a252e1be50d23c00024b4af72c8bcd9e6833bc8778dfb461e9a35e1a	2024-11-23 22:38:32.911165-05	20241124033832_add_username_field	\N	\N	2024-11-23 22:38:32.90509-05	1
7a5ff5d6-4547-426e-a322-966fe0053ba1	afe4211699c5fa6b15e4cba46747615233fcd2ebeabd62c6bb74b863cd5a62f3	2024-11-24 00:18:35.956993-05	20241124051835_update_address_creditcard_relations	\N	\N	2024-11-24 00:18:35.941186-05	1
4f64be3b-cea3-47ed-9b20-c21f09a80046	91e5ac07d2c2835c98ac2c787e83db6d7ffc10939663bca5a6a1242778885981	2024-11-24 01:34:49.578522-05	20241124063449_update_address_creditcard_relations	\N	\N	2024-11-24 01:34:49.567528-05	1
20801a2a-0230-4ad2-a16a-6d2c9e4d4792	fab17ccd212728d10a820cb5cb56060a64618ad08a1db90c47d23bf870d7e7a4	2024-11-24 01:37:41.950111-05	20241124063741_update_address_creditcard_relations	\N	\N	2024-11-24 01:37:41.947394-05	1
90d07d0a-c2b8-466d-bafa-c864b36e148f	b189a2a03a542b5a64c21e63539cf7bef666107b65922b4311adadd8801b7c87	2024-11-24 16:42:27.676939-05	20241124214227_add_is_admin_to_user	\N	\N	2024-11-24 16:42:27.670953-05	1
da2eb301-ea28-47c9-b8e6-1cb3bcc44a71	9655ce28b5992ccbc52ea1cada7fab5cb4788228bbb2fdcb666c344ae97ff83f	2024-11-24 17:21:17.757478-05	20241124222117_product_items	\N	\N	2024-11-24 17:21:17.748806-05	1
3fd086b0-29a9-4fdb-b663-e58519c08023	4a823a54582bc1794e628ae841d6ef0953baf538d1f9cf1568790baebf398244	2024-11-24 20:09:07.766234-05	20241125010907_	\N	\N	2024-11-24 20:09:07.756972-05	1
35223aa6-8bd0-41c0-9fda-5ba6a0754517	c4a18ab5dc07c48bcf20d61f7d0dd7a29809baf8157b80a83e1f369c9e191e3d	2024-11-25 00:31:35.814616-05	20241125053135_add_image_remove_brand	\N	\N	2024-11-25 00:31:35.810157-05	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, username, "creditCardId", "shippingAddressId", "isAdmin") FROM stdin;
1	admin@gmail.com	$2a$10$zGwuAGqKJqSHvfDfrS2qDueL810xQuR01xdq0rPGC9jVlO0D08Rs.	admin	\N	\N	t
16	test@example.com	$2a$10$sAWmCL7q1R8mCFbKtilqouxVyysRePBvuULSkcScM1Pse95wGi5Oi	testuser	\N	\N	f
5	blackbird3@gmail.com	$2a$10$FJSoI7tdjErycTYvB/ELx.uRZDOPItMXzMVrCo2tB7LZNRDwxsVGm	blackbird3	\N	\N	f
4	jacobchm@my.yorku.ca	$2a$10$pkamIMgBTKalWxg0XdMo3epwjTJTgCTvgXax0o1TYpr9uVJ26VdrG	testuserud2	3	3	f
2	blackbird2@gmail.com	$2a$10$zGwuAGqKJqSHvfDfrS2qDueL810xQuR01xdq0rPGC9jVlO0D08Rs.	blackbird2	4	1	f
17	admin2@gmail.com	$2a$10$JnQ8oOfLHk0FJWjr3PJk.epL0HitsR.lzVGj.aooJ3uDb39GXXpJS	admin2@gmail.com	\N	\N	f
18	admin3@gmail.com	$2a$10$smI9bMrj2B9BbU1c/e5Pe.LAyn6z/3cPMLXkf8wLOBJy9alTgYTa2	admin3	\N	\N	t
\.


--
-- Name: Address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Address_id_seq"', 16, true);


--
-- Name: CreditCardInfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CreditCardInfo_id_seq"', 4, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 17, true);


--
-- Name: ProductItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductItem_id_seq"', 86, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: CreditCardInfo CreditCardInfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreditCardInfo"
    ADD CONSTRAINT "CreditCardInfo_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ProductItem ProductItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductItem"
    ADD CONSTRAINT "ProductItem_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: CreditCardInfo CreditCardInfo_billingAddressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CreditCardInfo"
    ADD CONSTRAINT "CreditCardInfo_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_shippingAddressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductItem ProductItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductItem"
    ADD CONSTRAINT "ProductItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductItem ProductItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductItem"
    ADD CONSTRAINT "ProductItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_creditCardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES public."CreditCardInfo"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_shippingAddressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

