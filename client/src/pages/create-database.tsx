import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { ArrowRight } from 'react-feather';
import cx from 'classnames';

import { useCreateDatabaseMutation, DatabaseTypes } from '../generated/graphql';
import withApollo from '../lib/withApollo';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';
import { MySQLIcon } from '../ui/icons/MySQLIcon';
import { MongoIcon } from '../ui/icons/MongoIcon';
import { RedisIcon } from '../ui/icons/RedisIcon';
import { Protected } from '../modules/auth/Protected';
import { Header } from '../modules/layout/Header';

interface DatabaseBoxProps {
  label: string;
  selected: boolean;
  icon: React.ReactNode;
  onClick?(): void;
}

const DatabaseBox = ({ label, selected, icon, onClick }: DatabaseBoxProps) => {
  return (
    <div
      className={cx(
        'flex flex-col items-center p-12 bg-white border border-grey rounded cursor-pointer opacity-50 transition duration-200',
        {
          'border-black opacity-100': selected,
        }
      )}
      onClick={onClick}
    >
      <div className="mb-2">{icon}</div>
      <p>{label}</p>
    </div>
  );
};

const CreateDatabase = () => {
  const router = useRouter();
  const [createDatabaseMutation] = useCreateDatabaseMutation();
  const formik = useFormik<{ name: string; type: DatabaseTypes }>({
    initialValues: {
      name: '',
      type: 'POSTGRESQL',
    },
    onSubmit: async (values) => {
      // TODO validate name
      try {
        const data = await createDatabaseMutation({
          variables: {
            input: { name: values.name, type: values.type },
          },
        });
        // TODO redirect to database page once ready
        router.push('/dashboard');
      } catch (error) {
        // TODO catch errors
        console.log(error);
        alert(error);
      }
    },
  });

  return (
    <React.Fragment>
      <Header />

      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-bold">Create a new database</h1>

        <form onSubmit={formik.handleSubmit} className="mt-8">
          <div className="mt-12">
            <label className="block mb-2">Database name:</label>
            <input
              autoComplete="off"
              className="block w-full max-w-xs bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </div>

          <div className="mt-12">
            <label className="block mb-2">Choose your database</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DatabaseBox
                selected={formik.values.type === 'POSTGRESQL'}
                label="PostgreSQL"
                icon={<PostgreSQLIcon size={40} />}
                onClick={() => formik.setFieldValue('type', 'POSTGRESQL')}
              />
              <DatabaseBox
                selected={formik.values.type === 'MYSQL'}
                label="MySQL"
                icon={<MySQLIcon size={40} />}
                onClick={() => formik.setFieldValue('type', 'MYSQL')}
              />
              <DatabaseBox
                selected={formik.values.type === 'MONGODB'}
                label="Mongo"
                icon={<MongoIcon size={40} />}
                onClick={() => formik.setFieldValue('type', 'MONGODB')}
              />
              <DatabaseBox
                selected={formik.values.type === 'REDIS'}
                label="Redis"
                icon={<RedisIcon size={40} />}
                onClick={() => formik.setFieldValue('type', 'REDIS')}
              />
            </div>
            <div className="mt-2 text-gray-400">
              {formik.values.type === 'POSTGRESQL' && (
                <p>We currently only provide PostgreSQL</p>
              )}
              {formik.values.type === 'MYSQL' && (
                <p>
                  We currently don't support MySQL.
                  <br />
                  Take a look at{' '}
                  <a
                    href="https://github.com/ledokku/ledokku/issues/22"
                    className="underline"
                  >
                    the issue
                  </a>{' '}
                  to track the progress.
                </p>
              )}
              {formik.values.type === 'MONGODB' && (
                <p>
                  We currently don't support Mongo.
                  <br />
                  Take a look at{' '}
                  <a
                    href="https://github.com/ledokku/ledokku/issues/21"
                    className="underline"
                  >
                    the issue
                  </a>{' '}
                  to track the progress.
                </p>
              )}
              {formik.values.type === 'REDIS' && (
                <p>
                  We currently don't support Redis.
                  <br />
                  Take a look at{' '}
                  <a
                    href="https://github.com/ledokku/ledokku/issues/20"
                    className="underline"
                  >
                    the issue
                  </a>{' '}
                  to track the progress.
                </p>
              )}
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button
              className="py-3 px-4 bg-black text-white rounded flex justify-center"
              disabled={formik.isSubmitting}
              type="submit"
            >
              Create
              <ArrowRight className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default withApollo(() => (
  <Protected>
    <CreateDatabase />
  </Protected>
));
